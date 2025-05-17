'use strict';

/*
    @licstart  The following is the entire license notice for the
    JavaScript code in this page.

    Welcome to this software. BudgetWorkflow.com, ShareAndCollaborate.com. 
    Copyright (C) 2011-2023  Todd N. Hiltz
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

function bwEncodeURIComponent(str) {
    //return encodeURIComponent(str).replace(/[!'()*]/g, escape);
    //return encodeURIComponent(str).replace(/[']/g, escape); // encodeURIComponent does not do apostrophe's, which we need here, because we are passing this as defined method calls in the code, preformulated.
    //alert('In bwEncodeURIComponent().');
    return encodeURI(str).replace(/[']/g, escape);
}




var lastExceptionLogMessages = []; // Use this to prevent multiple entries being made due to recursion or a faulty loop.
function WriteToErrorLog(source, message) { // We need this 9-29-2022.
    try {
        console.log('In bw.core.js.WriteToErrorLog().');

        //alert('In bw.core.js.WriteToErrorLog().');

        if ((source == '') && (message == '')) {

            // This means we should try to write the errors to the log that couldn't go on the last attempt.
            if (errors != '') {
                var item = {
                    Errors: errors
                };
                $.ajax({
                    url: webserviceurl + "/writearchivederrorstoexceptionlog",
                    type: "POST",
                    data: item,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {

                        console.log('In bw.core.js.WriteToErrorLog./writearchivederrorstoexceptionlog.success(). data: ' + JSON.stringify(data));
                        displayAlertDialog('In bw.core.js.WriteToErrorLog./writearchivederrorstoexceptionlog.success(). data: ' + JSON.stringify(data));
                        errors = '';

                    },
                    error: function (data) {
                        // Todd: I got rid of this so it doesn't bother the user.
                        console.log('In bw.core.js.WriteToErrorLog./writearchivederrorstoexceptionlog.error(). data: ' + JSON.stringify(data));
                        displayAlertDialog('In bw.core.js.WriteToErrorLog./writearchivederrorstoexceptionlog.error(). data: ' + JSON.stringify(data));
                    }
                });
            }

        } else {


            // Added this throttling mechanism 10-22-2022
            var foundADuplicate = false;
            for (var i = 0; i < lastExceptionLogMessages.length; i++) {
                if (lastExceptionLogMessages[i] == message) {
                    foundADuplicate = true;
                }
            }

            if (foundADuplicate == true) {
                console.log('Skipping this exception log entry, it is a duplicate of the last one.');
            } else {

                if (lastExceptionLogMessages.length > 5) {
                    lastExceptionLogMessages = [];
                }
                lastExceptionLogMessages.push(message);


                

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');


                console.log('In bw.core.js.WriteToErrorLog(). xcx2131244123 calling /writetoexceptionlog [' + webserviceurl + '/writetoexceptionlog' + '] source: ' + source + ', message: ' + message);
                //alert('In bw.core.js.WriteToErrorLog(). xcx2131244123 calling /writetoexceptionlog [' + webserviceurl + '/writetoexceptionlog' + '] source: ' + source + ', message: ' + message);

                var userAgent = '';
                //if (window && window.navigator && window.navigator.userAgent) {
                //    userAgent = window.navigator.userAgent;
                //}

                navigator.mediaDevices.enumerateDevices().then(function (results) {

                    userAgent = JSON.stringify(results);

                    var item = {
                        Source: source,
                        Message: message,
                        bwWorkflowAppId: workflowAppId,
                        bwParticipantId: participantId,
                        bwParticipantFriendlyName: participantFriendlyName,
                        bwParticipantEmail: participantEmail,
                        ClientException: true, // This is true when it is a client side error. It is not necessary to populate this when a server side error. Added 6-5-2024. 
                        bwExceptionLogUserAgent: userAgent
                    };
                    $.ajax({
                        url: webserviceurl + "/writetoexceptionlog",
                        type: "POST",
                        data: item,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (results) {

                            console.log('In bw.core.js.WriteToErrorLog./writetoexceptionlog.success(). results: ' + JSON.stringify(results) + ', source: ' + source + ', message: ' + message);
                            //displayAlertDialog('In bw.core.js.WriteToErrorLog./writetoexceptionlog.success(). data: ' + JSON.stringify(data));

                        },
                        error: function (data) {

                            // Todd: I got rid of this so it doesn't bother the user.
                            console.log('In bw.core.js.WriteToErrorLog./writetoexceptionlog.error(). data: ' + JSON.stringify(data));
                            //displayAlertDialog('In bw.core.js.WriteToErrorLog./writetoexceptionlog.error(). data: ' + JSON.stringify(data));

                            if (data.status == 503) {
                                //alert("In bw.core.js.WriteToErrorLog(). Failed to write to error log: " + JSON.stringify(data));
                                console.log('');
                                console.log('***********************************');
                                console.log('***********************************');
                                console.log('Error in bw.core.js.WriteToErrorLog(). Cannot communicate with the back end servers.');
                                console.log('***********************************');
                                console.log('***********************************');
                                console.log('');
                            }

                            // When this happens, we will store the error, and when we regain contact, will try to save it again.
                            //var thisError = new Array(2);
                            //thisError[0] = source;
                            //thisError[1] = message;
                            //errors.push(thisError);

                            errors = errors + " ERROR SRC:" + source + " MSG:" + message;

                        }
                    });

                })

                
            }
        }

    } catch (e) {
        console.log('Exception in bw.core.js.WriteToErrorLog(): ' + e.message + ', ' + e.stack);
        displayAlertDialog('Exception in bw.core.js.WriteToErrorLog(): ' + e.message + ', ' + e.stack);
    }
}

function renderFavicon(displayTheReddot) {
    // This sets the favicon. We are displaying the currency. With a red dot when there are tasks for the user to perform.
    // "selectedCurrencySymbol" is expected to exist as a global variable.
    var currencySymbolFavicon = '';
    if (displayTheReddot == true) {
        switch (selectedCurrencySymbol) {
            case 'Dollar':
                currencySymbolFavicon = 'favicon-dollar-reddot.ico';
                break;
            case 'Pound':
                currencySymbolFavicon = 'favicon-pound-reddot.ico';
                break;
            case 'Euro':
                currencySymbolFavicon = 'favicon-euro-reddot.ico';
                break;
            case 'Rand':
                currencySymbolFavicon = 'favicon-rand-reddot.ico';
                break;
            case 'Franc':
                currencySymbolFavicon = 'favicon-franc-reddot.ico';
                break;
            case 'Yen':
                currencySymbolFavicon = 'favicon-yen-reddot.ico';
                break;
            case 'Rouble':
                currencySymbolFavicon = 'favicon-rouble-reddot.ico';
                break;
            case 'Peso':
                currencySymbolFavicon = 'favicon-peso-reddot.ico';
                break;
            case 'Rupee':
                currencySymbolFavicon = 'favicon-rupee-reddot.ico';
                break;
            case 'Guilder':
                currencySymbolFavicon = 'favicon-guilder-reddot.ico';
                break;
            default:
                currencySymbolFavicon = 'favicon.ico';
                break;
        }
    } else {
        switch (selectedCurrencySymbol) {
            case 'Dollar':
                currencySymbolFavicon = 'favicon-dollar.ico';
                break;
            case 'Pound':
                currencySymbolFavicon = 'favicon-pound.ico';
                break;
            case 'Euro':
                currencySymbolFavicon = 'favicon-euro.ico';
                break;
            case 'Rand':
                currencySymbolFavicon = 'favicon-rand.ico';
                break;
            case 'Franc':
                currencySymbolFavicon = 'favicon-franc.ico';
                break;
            case 'Yen':
                currencySymbolFavicon = 'favicon-yen.ico';
                break;
            case 'Rouble':
                currencySymbolFavicon = 'favicon-rouble.ico';
                break;
            case 'Peso':
                currencySymbolFavicon = 'favicon-peso.ico';
                break;
            case 'Rupee':
                currencySymbolFavicon = 'favicon-rupee.ico';
                break;
            case 'Guilder':
                currencySymbolFavicon = 'favicon-guilder.ico';
                break;
            default:
                currencySymbolFavicon = 'favicon.ico';
                break;
        }
    }
    document.getElementById('bwFavicon').href = 'https://budgetworkflow.com/' + currencySymbolFavicon;
}

function swapStyleSheet(sheet) {
    //alert('sheet: ' + sheet);
    document.getElementById("corecolors").setAttribute("href", sheet);
}

//function setCookie(cname, cvalue, exdays) {
//    var d = new Date();
//    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//    var expires = "expires=" + d.toUTCString();
//    document.cookie = cname + "=" + cvalue + "; " + expires;
//}

//function getCookie(cname) {
//    var name = cname + "=";
//    var ca = document.cookie.split(';');
//    for (var i = 0; i < ca.length; i++) {
//        var c = ca[i];
//        while (c.charAt(0) == ' ') {
//            c = c.substring(1);
//        }
//        if (c.indexOf(name) == 0) {
//            return c.substring(name.length, c.length);
//        }
//    }
//    return "";
//}

function cmdSaveCloseout() {
    var budgetRequestId = $('span[xd\\:binding = "my:BudgetRequestId"]')[0].innerHTML;
    var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;

    // Saving the closeout!
    var xmlDocument = createXmlDocument_ForCloseout(budgetRequestId);
    if (xmlDocument != 'ERROR') {
        var _budgetRequest = [];
        _budgetRequest = {
            bwBudgetRequestId: budgetRequestId,
            //Title: title,
            bwTenantId: tenantId,
            bwWorkflowAppId: workflowAppId,
            ModifiedById: participantId,
            ModifiedByEmail: participantEmail,
            ModifiedByFriendlyName: participantFriendlyName,
            CloseoutXml: xmlDocument.toString()
        };
        var operationUri = webserviceurl + "/bwbudgetrequests/savecloseout";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: _budgetRequest,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                //displayAlertDialog('The AR has been submitted.');
                displayAlertDialog(data);
                //window.location.href = 'my.html';
                //populateStartPageItem('divWelcome', 'Reports', '');
                renderWelcomeScreen();
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error in bw.core.js.cmdSaveCloseout(): ' + errorMessage);
            }
        });
    } else {
        // Error creating AR Xml.
        displayAlertDialog('There was an error. The closeout could not be saved.');
    }
}

function cmdInsertAssetItemOnCloseoutForm() {
    var currentRowCount = document.getElementById('tblNewAssetsOnCloseout').rows.length;
    // Don't create a new row until something is in the previous row. Todd: This needs to be completed.
    //if (currentRowCount > 1) {

    //}


    var html = '';
    html += '<tr>';
    html += '  <td>';
    html += '    <input type="text" id="txtNewAssetDescription' + currentRowCount + '" style="width:225px;"></input>';
    html += '  </td>';
    html += '  <td>';
    html += '    <input type="text" id="txtNewAssetId' + currentRowCount + '" style="width:75px;"></input>';
    html += '  </td>';
    html += '  <td>';
    html += '    <input type="text" id="txtNewAssetCost' + currentRowCount + '" onchange="calculateTotalAssetCostOnCloseoutForm();" style="width:100px;"></input>';
    html += '  </td>';
    html += '  <td>';
    html += '    <input type="text" id="txtNewAssetEstimatedLife' + currentRowCount + '" style="width:50px;"></input>';
    html += '  </td>';
    html += '  <td>';
    html += '    <input type="text" id="txtNewAssetCategory' + currentRowCount + '"></input>';
    html += '  </td>';
    html += '  <td>';
    html += '    <img src="images/trash-can.png" onclick="cmdDeleteAssetItemOnCloseoutForm(' + currentRowCount + ');" title="Delete" style="cursor:pointer;" />';
    html += '  </td>';
    html += '</tr>';
    $('#tblNewAssetsOnCloseout').append(html);

}

function cmdDeleteAssetItemOnCloseoutForm(rowNumber) {
    // First we have to figure out how many rows are in the table.
    var html = '';
    var tableRowCount = document.getElementById('tblNewAssetsOnCloseout').rows.length;
    var currentRowCount = -1;
    for (var i = 0; i < tableRowCount; i++) {
        if (i != rowNumber) {
            currentRowCount += 1;
            html += '<tr>';
            html += '  <td>';
            var descriptionFieldId = 'txtNewAssetDescription' + i;
            html += '    <input type="text" id="txtNewAssetDescription' + currentRowCount + '" value="' + document.getElementById(descriptionFieldId).value + '"></input>';
            html += '  </td>';
            html += '  <td>';
            var assetIdFieldId = 'txtNewAssetId' + i;
            html += '    <input type="text" id="txtNewAssetId' + currentRowCount + '" value="' + document.getElementById(assetIdFieldId).value + '"></input>';
            html += '  </td>';
            html += '  <td>';
            var assetCostFieldId = 'txtNewAssetCost' + i;
            html += '    <input type="text" id="txtNewAssetCost' + currentRowCount + '" value="' + document.getElementById(assetCostFieldId).value + '" onchange="calculateTotalAssetCostOnCloseoutForm();"></input>';
            html += '  </td>';
            html += '  <td>';
            var assetEstimatedLifeFieldId = 'txtNewAssetEstimatedLife' + i;
            html += '    <input type="text" id="txtNewAssetEstimatedLife' + currentRowCount + '" value="' + document.getElementById(assetEstimatedLifeFieldId).value + '"></input>';
            html += '  </td>';
            html += '  <td>';
            var assetCategoryFieldId = 'txtNewAssetCategory' + i;
            html += '    <input type="text" id="txtNewAssetCategory' + currentRowCount + '" value="' + document.getElementById(assetCategoryFieldId).value + '"></input>';
            html += '  </td>';
            html += '  <td>';
            html += '    <img src="images/trash-can.png" onclick="cmdDeleteAssetItemOnCloseoutForm(' + currentRowCount + ');" title="Delete" style="cursor:pointer;" />';
            html += '  </td>';
            html += '</tr>';
        }
    }
    $('#tblNewAssetsOnCloseout').empty();
    $('#tblNewAssetsOnCloseout').append(html);
    calculateTotalAssetCostOnCloseoutForm();
}

function calculateTotalAssetCostOnCloseoutForm() {
    var tableRowCount = document.getElementById('tblNewAssetsOnCloseout').rows.length;
    var assetTotalCost = 0;
    for (var i = 0; i < tableRowCount; i++) {
        var assetCostFieldId = 'txtNewAssetCost' + i;
        var cost = document.getElementById(assetCostFieldId).value;
        assetTotalCost = assetTotalCost + Number(cost);
    }
    // my:coTotalEquipmentCost

    $('span[xd\\:binding = "my:coTotalEquipmentCost"]')[0].innerHTML = formatCurrency(assetTotalCost);
}



function createXmlDocument_ForCloseout(budgetRequestId) {
    var doc = '<?xml version="1.0" encoding="UTF-8"?>';
    try {
        var innertext = false;

        //var doc = '<?xml version="1.0" encoding="UTF-8"?>';
        //doc += '<?mso-infoPathSolution name="urn:schemas-microsoft-com:office:infopath:Budget-Form:-myXSD-2012-09-11T20-22-29" href="manifest.xsf" solutionVersion="1.0.1.2243" productVersion="14.0.0" PIVersion="1.0.0.0" ?>';
        //doc += '<?mso-application progid="InfoPath.Document" versionProgid="InfoPath.Document.3"?>';
        //doc += '<?mso-infoPath-file-attachment-present?>';
        //doc += '<my:myFields xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls" xmlns:ma="http://schemas.microsoft.com/office/2009/metadata/properties/metaAttributes" xmlns:d="http://schemas.microsoft.com/office/infopath/2009/WSSList/dataFields" xmlns:q="http://schemas.microsoft.com/office/infopath/2009/WSSList/queryFields" xmlns:dfs="http://schemas.microsoft.com/office/infopath/2003/dataFormSolution" xmlns:dms="http://schemas.microsoft.com/office/2009/documentManagement/types" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:my="http://schemas.microsoft.com/office/infopath/2003/myXSD/2012-09-11T20:22:29" xmlns:xd="http://schemas.microsoft.com/office/infopath/2003">';

        doc += '<my:myFields xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:my="http://schemas.microsoft.com/office/infopath/2003/myXSD/2012-09-11T20:22:29"  xmlns:xd="http://schemas.microsoft.com/office/infopath/2003">';

        doc += '<my:BudgetRequestId>' + budgetRequestId + '</my:BudgetRequestId>';

        var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;
        doc += '<my:Title>' + title + '</my:Title>';
        //var curRequestedCapital = $('span[xd\\:binding = "my:Requested_Capital"]')[0].innerHTML;
        //doc += '<my:Requested_Capital>' + curRequestedCapital + '</my:Requested_Capital>';

        //var curFunctionalAreaId = $('span[xd\\:binding = "my:Functional_Area_Id"]')[0].innerHTML;
        //doc += '<my:Functional_Area_Id>' + curFunctionalAreaId + '</my:Functional_Area_Id>';

        //var curFunctionalArea = $('span[xd\\:binding = "my:Functional_Area"]')[0].innerHTML;
        //doc += '<my:Functional_Area>' + curFunctionalArea + '</my:Functional_Area>';

        //var curBriefDescription = $('span[xd\\:binding = "my:Brief_Description_of_Project"]')[0].innerHTML;
        //doc += '<my:Brief_Description_of_Project>' + curBriefDescription + '</my:Brief_Description_of_Project>';

        //var curProjectName = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML;
        //doc += '<my:Project_Name>' + curProjectName + '</my:Project_Name>';

        //var curRequestedExpense = $('span[xd\\:binding = "my:Requested_Expense"]')[0].innerHTML;
        //doc += '<my:Requested_Expense xsi:nil="true">' + curRequestedExpense + '</my:Requested_Expense>';

        //var curEstimatedStartDate = $('span[xd\\:binding = "my:Estimated_Start_Date"]')[0].innerHTML;
        //doc += '<my:Estimated_Start_Date>' + curEstimatedStartDate + '</my:Estimated_Start_Date>';

        //var curEstimatedEndDate = $('span[xd\\:binding = "my:Estimated_End_Date"]')[0].innerHTML;
        //doc += '<my:Estimated_End_Date>' + curEstimatedEndDate + '</my:Estimated_End_Date>';

        //var curBudgetAmount = $('span[xd\\:binding = "my:Budget_Amount2"]')[0].innerHTML;
        //doc += '<my:Budget_Amount2>' + curBudgetAmount + '</my:Budget_Amount2>';

        //var curLocation = encodeURIComponent($('span[xd\\:binding = "my:Location"]')[0].innerHTML);
        //doc += '<my:Location>' + curLocation + '</my:Location>';

        //doc += '<my:Cost_Center></my:Cost_Center>';
        //doc += '<my:FormStatus>FALSE</my:FormStatus>';
        //doc += '<my:Budget_Category></my:Budget_Category>';
        //doc += '<my:field3 xsi:nil="true"></my:field3>';

        //doc += '<my:AttachmentsFolderName>';
        //doc += $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
        //doc += '</my:AttachmentsFolderName>';

        //doc += '<my:CapexAttachmentsGroup>';
        //doc += '    <my:CapexAttachments>';
        //doc += '    	<my:CapexAttachment xsi:nil="true"></my:CapexAttachment>';
        //doc += '    </my:CapexAttachments>';
        //doc += '</my:CapexAttachmentsGroup>';

        //var curYear = $('span[xd\\:binding = "my:Year"]')[0].innerHTML;
        //doc += '<my:Year>' + curYear + '</my:Year>';

        //doc += '<my:field4></my:field4>';

        //var displayName = $('span[xd\\:binding = "my:Project_Manager_Hidden"]')[0].innerHTML;
        //var accountId = $('span[xd\\:binding = "my:Project_Manager_AccountId"]')[0].innerHTML;
        //var accountType = $('span[xd\\:binding = "my:Project_Manager_AccountType"]')[0].innerHTML;
        //doc += '<my:Project_Manager_Hidden>';
        //doc += '	<pc:Person>';
        //doc += '		<pc:DisplayName>' + displayName + '</pc:DisplayName>';
        //doc += '		<pc:AccountId>' + accountId + '</pc:AccountId>';
        //doc += '		<pc:AccountType>' + accountType + '</pc:AccountType>';
        //doc += '	</pc:Person>';
        //doc += '</my:Project_Manager_Hidden>';

        //doc += '<my:Current_Status></my:Current_Status>';
        //doc += '<my:Status></my:Status>';
        //doc += '<my:ddlCostOfEquipmentAndParts></my:ddlCostOfEquipmentAndParts>';

        //var costOfEquipmentAndParts = $('span[xd\\:binding = "my:CostOfEquipmentAndParts"]')[0].innerHTML;
        //doc += '<my:CostOfEquipmentAndParts>' + costOfEquipmentAndParts + '</my:CostOfEquipmentAndParts>';

        //var costOfInternalLabor = $('span[xd\\:binding = "my:CostOfInternalLabor"]')[0].innerHTML;
        //doc += '<my:CostOfInternalLabor>' + costOfInternalLabor + '</my:CostOfInternalLabor>';

        //var costOfOutsideServices = $('span[xd\\:binding = "my:CostOfOutsideServices"]')[0].innerHTML;
        //doc += '<my:CostOfOutsideServices>' + costOfOutsideServices + '</my:CostOfOutsideServices>';

        //doc += '<my:ddlCostOfOutsideServices></my:ddlCostOfOutsideServices>';

        //var otherExpense = $('span[xd\\:binding = "my:OtherExpense"]')[0].innerHTML;
        //doc += '<my:OtherExpense>' + otherExpense + '</my:OtherExpense>';

        //var otherCapital = $('span[xd\\:binding = "my:OtherCapital"]')[0].innerHTML;
        //doc += '<my:OtherCapital>' + otherCapital + '</my:OtherCapital>';

        //doc += '<my:CapitalTotal xsi:nil="true"></my:CapitalTotal>';
        //doc += '<my:ExpenseTotal xsi:nil="true"></my:ExpenseTotal>';
        //doc += '<my:TotalCosts xsi:nil="true"></my:TotalCosts>';

        //var salesTax = $('span[xd\\:binding = "my:SalesTax"]')[0].innerHTML;
        //doc += '<my:SalesTax>' + salesTax + '</my:SalesTax>';



        //var group3 = $('span[xd\\:binding = "my:group3"]')[0].innerHTML;
        //doc += '<my:group3>' + group3 + '</my:group3>';
        ////// Cost of Equipment and Parts.
        ////var eapHTML = document.getElementById('equipmentAndPartsList').innerHTML;
        ////var eapXml = "";
        ////var eapCount = 0;
        ////var eapKeepGoing = true;
        ////try {
        ////    var eapNode = $.parseHTML(eapHTML);
        ////    while (eapKeepGoing) {
        ////        var t = eapNode[eapCount].innerHTML;
        ////        var tNode = $.parseHTML(t);
        ////        var nodeContents = tNode[0].innerHTML;
        ////        if (nodeContents != "") {
        ////            eapXml += '<my:EquipmentAndParts>' + nodeContents + '</my:EquipmentAndParts>';
        ////        }
        ////        eapCount += 1;
        ////    }
        ////} catch (e2) {
        ////    eapKeepGoing = false; // We have reached the end of the list. We now know how many items are in the list.
        ////}
        ////doc += '<my:group3>';
        ////if (eapXml != "") {
        ////    doc += eapXml;
        ////}
        ////doc += '</my:group3>';

        //var group6 = $('span[xd\\:binding = "my:group6"]')[0].innerHTML;
        //doc += '<my:group6>' + group6 + '</my:group6>';
        //// Cost of Internal Labor.
        ////var cilHTML = document.getElementById('internalLaborList').innerHTML;
        ////var cilXml = "";
        ////var cilCount = 0;
        ////var cilKeepGoing = true;
        ////try {
        ////    var cilNode = $.parseHTML(cilHTML);
        ////    while (cilKeepGoing) {
        ////        var t = cilNode[cilCount].innerHTML;
        ////        var tNode = $.parseHTML(t);
        ////        var nodeContents = tNode[0].innerHTML;
        ////        if (nodeContents != "") {
        ////            cilXml += '<my:CostOfInteralLabor>' + nodeContents + '</my:CostOfInteralLabor>';
        ////        }
        ////        cilCount += 1;
        ////    }
        ////} catch (e2) {
        ////    cilKeepGoing = false; // We have reached the end of the list. We now know how many items are in the list.
        ////}
        ////doc += '<my:group6>';
        ////if (cilXml != "") {
        ////    doc += cilXml;
        ////}
        ////doc += '</my:group6>';


        //var group4 = $('span[xd\\:binding = "my:group4"]')[0].innerHTML;
        //doc += '<my:group4>' + group4 + '</my:group4>';
        //// Cost of Outside Services.
        ////var ltiHTML = document.getElementById('laborToInstallList').innerHTML;
        ////var ltiXml = "";
        ////var ltiCount = 0;
        ////var ltiKeepGoing = true;
        ////try {
        ////    var ltiNode = $.parseHTML(ltiHTML);
        ////    while (ltiKeepGoing) {
        ////        var t = ltiNode[ltiCount].innerHTML;
        ////        var tNode = $.parseHTML(t);
        ////        var nodeContents = tNode[0].innerHTML;
        ////        if (nodeContents != "") {
        ////            ltiXml += '<my:LaborToInstall>' + nodeContents + '</my:LaborToInstall>';
        ////        }
        ////        ltiCount += 1;
        ////    }
        ////} catch (e2) {
        ////    ltiKeepGoing = false; // We have reached the end of the list. We now know how many items are in the list.
        ////}
        ////doc += '<my:group4>';
        ////if (ltiXml != "") {
        ////    doc += ltiXml;
        ////}
        ////doc += '</my:group4>';


        //var group14 = $('span[xd\\:binding = "my:group14"]')[0].innerHTML;
        //doc += '<my:group14>' + group14 + '</my:group14>';
        //// Other Costs.
        ////var ocHTML = document.getElementById('otherCostsList').innerHTML;
        ////var ocXml = "";
        ////var ocCount = 0;
        ////var ocKeepGoing = true;
        ////try {
        ////    var ocNode = $.parseHTML(ocHTML);
        ////    while (ocKeepGoing) {
        ////        var t = ocNode[ocCount].innerHTML;
        ////        var tNode = $.parseHTML(t);
        ////        var nodeContents = tNode[0].innerHTML;
        ////        if (nodeContents != "") {
        ////            ocXml += '<my:OtherCosts>' + nodeContents + '</my:OtherCosts>';
        ////        }
        ////        ocCount += 1;
        ////    }
        ////} catch (e2) {
        ////    ocKeepGoing = false; // We have reached the end of the list. We now know how many items are in the list.
        ////}
        ////doc += '<my:group14>';
        ////if (ocXml != "") {
        ////    doc += ocXml;
        ////}
        ////doc += '</my:group14>';

        //doc += '<my:sectionSalesTaxNote></my:sectionSalesTaxNote>';
        //doc += '<my:MaterialSavings>0</my:MaterialSavings>';
        //doc += '<my:AnnualLaborSavings>0</my:AnnualLaborSavings>';
        //doc += '<my:OtherSavings>0</my:OtherSavings>';
        //doc += '<my:PaybackMonths>0</my:PaybackMonths>';
        //doc += '<my:TotalAnnualSavings>0</my:TotalAnnualSavings>';
        //doc += '<my:statusfield></my:statusfield>';

        //var curNecessityOfProposedExpenditure = $('span[xd\\:binding = "my:NecessityOfProposedExpenditure"]')[0].innerHTML;
        //doc += '<my:NecessityOfProposedExpenditure>' + curNecessityOfProposedExpenditure + '</my:NecessityOfProposedExpenditure>';

        //var curDoesThisRequireItResources = $('span[xd\\:binding = "my:field29"]')[0].innerHTML;
        //doc += '<my:field29>' + curDoesThisRequireItResources + '</my:field29>';

        //var curAreThereAssetDispositions = $('span[xd\\:binding = "my:AreThereAssetDispositions"]')[0].innerHTML;
        //doc += '<my:AreThereAssetDispositions>' + curAreThereAssetDispositions + '</my:AreThereAssetDispositions>';

        //var curLifeExpectancyOfProjectInMonths = $('span[xd\\:binding = "my:LifeExpectancyOfProjectInMonths"]')[0].innerHTML;
        //doc += '<my:LifeExpectancyOfProjectInMonths>' + curLifeExpectancyOfProjectInMonths + '</my:LifeExpectancyOfProjectInMonths>';

        //doc += '<my:group8>';
        //doc += '    <my:SupplementalRequests></my:SupplementalRequests>';
        //doc += '</my:group8>';
        //doc += '<my:group12>';
        //doc += '    <my:group13></my:group13>';
        //doc += '</my:group12>';
        //doc += '<my:ItemId></my:ItemId>';
        //doc += '<my:Project_Manager></my:Project_Manager>';
        //doc += '<my:BookValue xsi:nil="true"></my:BookValue>';
        //doc += '<my:OtherSavingsDetails></my:OtherSavingsDetails>';
        //doc += '<my:BookValueSection></my:BookValueSection>';
        //doc += '<my:SalesTaxSection></my:SalesTaxSection>';

        //var curArTitle = "";
        //doc += '<my:ARTitle>' + curArTitle + '</my:ARTitle>';

        //doc += '<my:CreatedBy></my:CreatedBy>';
        //doc += '<my:CreatedDate></my:CreatedDate>';
        //doc += '<my:txtSpreadsheetData></my:txtSpreadsheetData>';
        //doc += '<my:FunctionalAreas>';
        //doc += '    <my:FunctionalArea>';
        //doc += '    	<my:Displayname></my:Displayname>';
        //doc += '    </my:FunctionalArea>';
        //doc += '</my:FunctionalAreas>';
        //doc += '<my:CloseOuts>';
        //doc += '    <my:CloseOut>';
        //doc += '    	<my:CloseOutUrl my:CloseOutUrlText=""></my:CloseOutUrl>';
        //doc += '    </my:CloseOut>';
        //doc += '</my:CloseOuts>';
        //doc += '<my:SupplementalARs>';
        //doc += '    <my:SupplementalAR>';
        //doc += '    	<my:SupplementalARUrl my:SupplementalARUrlText=""></my:SupplementalARUrl>';
        //doc += '    </my:SupplementalAR>';
        //doc += '</my:SupplementalARs>';
        //doc += '<my:coARNumber></my:coARNumber>';


        // Closeout fields!!!!
        var locationOfAsset = removeHtml($('span[xd\\:binding = "my:coLocationOfEquipment"]')[0].innerHTML);
        doc += '<my:coLocationOfEquipment>' + locationOfAsset + '</my:coLocationOfEquipment>'; // Active closeout field.

        var closeOutDate = document.getElementById('dtCloseoutDate').value;
        doc += '<my:coDate>' + closeOutDate + '</my:coDate>'; // Active closeout field.

        var internalOrderNumber = removeHtml($('span[xd\\:binding = "my:coSAPInternalOrderNumber"]')[0].innerHTML);
        //displayAlertDialog('internalOrderNumber: ' + internalOrderNumber);
        doc += '<my:coSAPInternalOrderNumber>' + internalOrderNumber + '</my:coSAPInternalOrderNumber>'; // Active closeout field.

        var costCenter = removeHtml($('span[xd\\:binding = "my:coCostCenter"]')[0].innerHTML);
        doc += '<my:coCostCenter>' + costCenter + '</my:coCostCenter>'; // Active closeout field.

        doc += '<my:coProjectTitle></my:coProjectTitle>';

        var estimatedAmountClosed = removeHtml($('span[xd\\:binding = "my:coEstimatedAmountClosed"]')[0].innerHTML);
        doc += '<my:coEstimatedAmountClosed>' + estimatedAmountClosed + '</my:coEstimatedAmountClosed>'; // Active closeout field.

        //var closedOutBudgetAmount = $('span[xd\\:binding = "my:coBudgetAmount"]')[0].innerHTML;
        //doc += '<my:coBudgetAmount>' + closedOutBudgetAmount + '</my:coBudgetAmount>'; // Active closeout field.

        var equipmentReplaced = removeHtml($('span[xd\\:binding = "my:coEquipmentReplaced"]')[0].innerHTML);
        doc += '<my:coEquipmentReplaced>' + equipmentReplaced + '</my:coEquipmentReplaced>'; // Active closeout field.

        var propertyNumber = removeHtml($('span[xd\\:binding = "my:coPropertyNumber"]')[0].innerHTML);
        doc += '<my:coPropertyNumber>' + propertyNumber + '</my:coPropertyNumber>'; // Active closeout field.

        var onSite = false;
        if (document.getElementById('cbOnSiteButOutOfService').checked) {
            onSite = true;
        }
        doc += '<my:coOnSiteButOutOfService>' + onSite + '</my:coOnSiteButOutOfService>'; // Active closeout field.

        var inStorage = false;
        if (document.getElementById('cbInStorage').checked) {
            inStorage = true;
        }
        doc += '<my:coInStorage>' + inStorage + '</my:coInStorage>'; // Active closeout field.

        var scrapped = false;
        if (document.getElementById('cbScrapped').checked) {
            scrapped = true;
        }
        doc += '<my:coScrapped>' + scrapped + '</my:coScrapped>'; // Active closeout field.

        var transferred = false;
        if (document.getElementById('cbTransfer').checked) {
            transferred = true;
        }
        doc += '<my:coTransfer>' + transferred + '</my:coTransfer>'; // Active closeout field.

        var explanation = removeHtml($('span[xd\\:binding = "my:coExplanation"]')[0].innerHTML);
        doc += '<my:coExplanation>' + explanation + '</my:coExplanation>'; // Active closeout field.

        doc += '<my:coProjectManager></my:coProjectManager>';

        var placedIntoServiceDate = document.getElementById('dtPlacedIntoServiceDate').value;
        doc += '<my:coPlacedIntoServiceDate>' + placedIntoServiceDate + '</my:coPlacedIntoServiceDate>'; // Active closeout field.




        // This is the section at the bottom of the page. There can be an arbitrary amount of rows here!

        doc += '<my:coEquipmentGroup>'; // Active closeout field.
        doc += '    <my:coAssetRegistrarEquipment>'; // Active closeout field.
        doc += '    	<my:coNewAssetDescription></my:coNewAssetDescription>'; // Active closeout field.
        doc += '    	<my:coNewPropertyNumber>0</my:coNewPropertyNumber>'; // Active closeout field.
        doc += '    	<my:coCostWithInstallation>0</my:coCostWithInstallation>'; // Active closeout field.
        doc += '    	<my:coEstimatedUsefulLife>0</my:coEstimatedUsefulLife>'; // Active closeout field.
        doc += '    	<my:coCategory></my:coCategory>'; // Active closeout field.
        doc += '    </my:coAssetRegistrarEquipment>'; // Active closeout field.
        doc += '</my:coEquipmentGroup>'; // Active closeout field.

        var totalEquipmentCost = removeHtml($('span[xd\\:binding = "my:coTotalEquipmentCost"]')[0].innerHTML);
        doc += '<my:coTotalEquipmentCost>' + totalEquipmentCost + '</my:coTotalEquipmentCost>'; // Active closeout field.


        doc += '</my:myFields>';
    } catch (e) {
        var xml = doc;
        displayAlertDialog('Error in bw.core.js.createXmlDocument_ForCloseout(): ' + e.message);
        WriteToErrorLog('Error in bw.core.js.createXmlDocument_ForCloseout()', 'Error creating AR XML: ' + e.name + ', ' + e.message);
        WriteToErrorLog('createXmlDocument_ForCloseout()', xml);
        doc = 'ERROR';
    } finally {
        return doc;
    }
}

function cmdAbandonTheAr_AdditionalInformation() {
    try {
        // Validate that the comments textbox has something in it. You can't ask for additional information without it!
        var comments = removeHtml($('span[xd\\:binding = "my:ReviewerComments"]')[0].innerHTML);
        if (comments == "") {
            displayAlertDialog('The "Comments" text box cannot be empty when abandoning a Budget Request.');
            //$('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
        } else {
            displayWorkingOnItDialog();
            //window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Working on it...', '');
            try {
                var functionalAreaId = $('span[xd\\:binding = "my:Functional_Area_Id"]')[0].innerHTML;
                var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
            } catch (e) {
                displayAlertDialog('Error in cmdAbandonTheAr_AdditionalInformation():1: ' + e.message + ' ' + e.stack);
            }
            $.ajax({
                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (faData) {
                    try {
                        var assignBudgetUserId;
                        var isApprover = false;
                        var _budgetRequest = [];
                        var xmlDocument = '';
                        for (var i = 0; i < faData.d.results.length; i++) {
                            if (functionalAreaId == faData.d.results[i].bwFunctionalAreaId) { // Todd: This isn't necessary because we should only get this value back. However, lets leave it for now.
                                // multiple user check. removing for this version
                                //var assignBudgetUsers = data.d.results[0].Approver1Id.results;
                                //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                //    var assignBudgetUserId = assignBudgetUsers[u]; //data.d.results[0].Approver1Id.results[u];
                                //    if (assignBudgetUserId == userId) isApprover = true;
                                //}
                                assignBudgetUserId = faData.d.results[i].Approver1Id;
                                if (assignBudgetUserId == participantId) isApprover = true;
                                if (isApprover) {
                                    // We are ready to save and approve the AR!!! This is the new approach 1-30-16.
                                    xmlDocument = createXmlDocument_AdditionalInformation(participantFriendlyName, filename);
                                    if (xmlDocument == 'FAILED') {
                                        displayAlertDialog('Failed to create XML.');
                                    } else {
                                        var created = getCreatedTimestamp();
                                        var duedate = getDueDateTimestamp();
                                        _budgetRequest = {
                                            bwBudgetRequestId: filename,
                                            bwTenantId: tenantId,
                                            bwWorkflowAppId: workflowAppId,
                                            //ProjectTitle: brData.ProjectTitle,
                                            Created: created,
                                            Modified: created,
                                            ModifiedById: participantId,
                                            ModifiedByEmail: participantEmail,
                                            ModifiedByFriendlyName: participantFriendlyName,
                                            bwDocumentXml: xmlDocument.toString(),
                                            CurrentOwner: participantId,
                                            bwDueDate: duedate,
                                            bwAssignedTo: participantEmail,
                                            bwAssignedToId: participantId,
                                            participantFriendlyName: participantFriendlyName
                                        };
                                    }
                                }
                            }
                        }
                        if (xmlDocument == 'FAILED') {
                            // We already displayed this above. // displayAlertDialog('Failed to create XML.');
                        } else {
                            if (isApprover) {
                                var operationUri = webserviceurl + "/bwbudgetrequests/abandonthear";
                                $.ajax({
                                    url: operationUri,
                                    type: "POST", timeout: ajaxTimeout,
                                    data: _budgetRequest,
                                    headers: {
                                        "Accept": "application/json; odata=verbose"
                                    },
                                    success: function (data) {
                                        try {
                                            //displayAlertDialog(data);
                                            $('#divWorkingOnItDialog').dialog('close');

                                            renderWelcomeScreen();
                                        } catch (e) {
                                            displayAlertDialog('Error in cmdAbandonTheAr_AdditionalInformation():2: ' + e.message + ' ' + e.stack);
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {
                                        displayAlertDialog('Error in bw.core.js.cmdAbandonTheAr_AdditionalInformation(). Error while saving the task outcome: ' + errorCode + ', ' + errorMessage);
                                        WriteToErrorLog('Error in bw.core.js.cmdAbandonTheAr_AdditionalInformation()', 'Error creating the budget request in budgetrequests library: ' + errorCode + ', ' + errorMessage);
                                    }
                                });
                            } else {
                                displayAlertDialog('You are not an Approver, and cannot reject the budget request. assignBudgetUserId: ' + assignBudgetUserId);
                            }
                        }
                    } catch (e) {
                        displayAlertDialog('Error in cmdAbandonTheAr_AdditionalInformation():3: ' + e.message + ' ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error accessing the functional areas.');
                    WriteToErrorLog('Error in bw.js.cmdAbandonTheAr_AdditionalInformation()', 'Error accessing the functional areas: ' + errorCode + ', ' + errorMessage);
                }
            });
        }
    } catch (e) {
        displayAlertDialog('Error in cmdAbandonTheAr_AdditionalInformation():4: ' + e.message + ' ' + e.stack);
    }
}

function removeHtml(content) {
    // This normalizes a text input to remove html and other troublesome content.
    var t1 = content.replace(/&nbsp;/g, ' ');
    var t2 = t1.replace(/<p>/g, ' ');
    var t3 = t2.replace(/<\/p>/g, ' ');
    var t4 = t3.replace(/<P>/g, ' ');
    var t5 = t4.replace(/<\/P>/g, ' ');
    var t6 = t5.replace(/<.*>/g, '');
    var t7 = t6.replace(/</g, '&lt;');
    var t8 = t7.replace(/>/g, '&gt;');
    var t9 = t8.replace(/|/g, '');
    //var t10 = t9.replace(/&/g, '&amp;'); // Do not do this!
    return t9;
}

function ToggleExpandComments() {
    // was cmdExpandComments()
    try {
        var image = document.getElementById('imgExpandComments');
        if (image) {
            if (image.src.toString().indexOf('plus-sign.png') > -1) {
                image.src = '../images/minus-sign.png';
                document.getElementById('consolidatedComments').style.display = 'block';
            } else {
                image.src = '../images/plus-sign.png';
                document.getElementById('consolidatedComments').style.display = 'none';
            }
        }
    } catch (e) {
        displayAlertDialog('Error in ToggleExpandComments(): ' + e.message);
    }
}

function decodeUriInAllFields() {
    $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML);
    $('span[xd\\:binding = "my:Brief_Description_of_Project"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:Brief_Description_of_Project"]')[0].innerHTML);
    //try {
    //    $('span[xd\\:binding = "my:ConsolidatedComments"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:ConsolidatedComments"]')[0].innerHTML);
    //} catch (e) { }
    try {
        $('span[xd\\:binding = "my:NecessityOfProposedExpenditure"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:NecessityOfProposedExpenditure"]')[0].innerHTML);
        $('span[xd\\:binding = "my:Location"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:Location"]')[0].innerHTML);
        //$('span[xd\\:binding = "my:LifeExpectancyOfProjectInMonths"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:LifeExpectancyOfProjectInMonths"]')[0].innerHTML);
        $('span[xd\\:binding = "my:group15/my:EstimatedCostsExplanation"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:group15/my:EstimatedCostsExplanation"]')[0].innerHTML);
        $('span[xd\\:binding = "my:SavingsNotes"]')[0].innerHTML = decodeURIComponent($('span[xd\\:binding = "my:SavingsNotes"]')[0].innerHTML);
    } catch (e) { }
}

function clearEmptyListItems() {
    // Get rid of the empty element if no contents in the <span> tag. This keeps an empty item from being displayed.
    // Cost of Equipment and Parts.
    try {
        var eapNode = $.parseHTML(document.getElementById('equipmentAndPartsList').innerHTML);
        if (eapNode[0].innerHTML != "") {
            var eapNodeSpanTag = $.parseHTML(eapNode[0].innerHTML); // Get the contents of the <span> tag.
            if (eapNodeSpanTag[0].innerHTML === "") {
                document.getElementById('equipmentAndPartsList').innerHTML = "";
            }
        }
        // Cost of Internal Labor.
        var ilNode = $.parseHTML(document.getElementById('internalLaborList').innerHTML);
        if (ilNode[0].innerHTML != "") {
            var ilNodeSpanTag = $.parseHTML(ilNode[0].innerHTML); // Get the contents of the <span> tag.
            if (ilNodeSpanTag[0].innerHTML === "") {
                document.getElementById('internalLaborList').innerHTML = "";
            }
        }
        // Cost of Outside Services.
        var ltiNode = $.parseHTML(document.getElementById('laborToInstallList').innerHTML);
        if (ltiNode[0].innerHTML != "") {
            var ltiNodeSpanTag = $.parseHTML(ltiNode[0].innerHTML); // Get the contents of the <span> tag.
            if (ltiNodeSpanTag[0].innerHTML === "") {
                document.getElementById('laborToInstallList').innerHTML = "";
            }
        }
        // Other Costs.
        var ocNode = $.parseHTML(document.getElementById('otherCostsList').innerHTML);
        if (ocNode[0].innerHTML != "") {
            var ocNodeSpanTag = $.parseHTML(ocNode[0].innerHTML); // Get the contents of the <span> tag.
            if (ocNodeSpanTag[0].innerHTML === "") {
                document.getElementById('otherCostsList').innerHTML = "";
            }
        }
    } catch (e) {
        // We don't need to catch this one because the errors we are concerned with are empty nodes and are of no consequence.
    }
}

function displaySupplementalsOnBudgetRequestForm(data) {
    // Display Supplementals list!
    if (data.d.results[1].length > 0) {
        //displayAlertDialog('This BR has supplementals2!!!');
        var html = '';
        html += '<table style="width:100%;">';
        for (var z = 0; z < data.d.results[1].length; z++) {
            if (z == 0) {
                html += ' <tr>';
                html += '    <td>';
                html += '      There are ' + data.d.results[1].length + ' supplemental request(s):<br />';
                html += '    </td>';
                html += '    <td style="width:5%;white-space:nowrap;">';
                //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';


                //displayAlertDialog('yyyy' + JSON.stringify(data));

                html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + 'x5x5x5' + '\');">' + data.d.results[1][z].Title + ' (' + data.d.results[1][z].ProjectTitle + ')</a><br />';
                html += '    </td>';
                html += '  </tr>';
            } else {
                html += ' <tr>';
                html += '    <td>';
                html += '    </td>';
                html += '    <td style="width:5%;white-space:nowrap;">';
                //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + 'x4x4x4' + '\');">' + data.d.results[1][z].Title + ' (' + data.d.results[1][z].ProjectTitle + ')</a><br />';
                html += '    </td>';
                html += '  </tr>';
            }
        }
        html += '</table>';
        document.getElementById('spanRelatedRequestsList').innerHTML = html;
    }
}

function displayRootBudgetRequestOnSupplementalForm(data) {
    // Display the originating Budget Request link!
    var html = '';
    html += '<table style="width:100%;">';
    html += ' <tr>';
    html += '    <td>';
    html += '    </td>';
    html += '    <td style="width:5%;white-space:nowrap;">';
    html += 'This is a supplemental request originating from: <a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][0].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + 'x4x4x4' + '\');">' + data.d.results[1][0].Title + ' (' + data.d.results[1][0].ProjectTitle + ')</a><br />';
    html += '    </td>';
    html += '  </tr>';
    html += '</table>';
    document.getElementById('spanRelatedRequestsList').innerHTML = html;
}

function formatStartAndEndDates() {
    try {
        // Check if the $('#dtEstimatedStartDatex').type attribute = "date". If so, it is the iOS .xsl view.
        if ($('#dtEstimatedStartDatex').attr('type') == 'date') {
            // This is an iOS date picker.
            document.getElementById('dtEstimatedStartDatex').value = formatMMDDYYYYDateForIos8($('span[xd\\:binding = "my:Estimated_Start_Date"]')[0].innerHTML);
            document.getElementById('dtEstimatedEndDatex').value = formatMMDDYYYYDateForIos8($('span[xd\\:binding = "my:Estimated_End_Date"]')[0].innerHTML);
            //var dt = document.getElementById('dtEstimatedStartDatex').value;
            //displayAlertDialog('The date is: ' + dt);
        } else {
            // This is a NON iOS date picker. I would like to do this with xslt but for now this approach works.
            document.getElementById('dtEstimatedStartDatex').value = $('span[xd\\:binding = "my:Estimated_Start_Date"]')[0].innerHTML;
            document.getElementById('dtEstimatedEndDatex').value = $('span[xd\\:binding = "my:Estimated_End_Date"]')[0].innerHTML;
            // Then we bind the jquery datepicker.
            $('#dtEstimatedStartDatex').datepicker();
            $('#dtEstimatedEndDatex').datepicker();
        }
    } catch (e) {
        console.log('Exception in bw.core.js.formatStartAndEndDates(): ' + e.message + ', ' + e.stack);
    }
}

function displayForm_DisplayArBasedOnWorkflowStatus2(budgetRequestId, action, participantId) {

    console.log('Starting bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus2(' + budgetRequestId + ', ' + action + ', ' + participantId + ').');

    var filename = budgetRequestId;

    var operationUri = webserviceurl + "/bwbudgetrequests/" + budgetRequestId + '/' + participantId;
    try {
        $.ajax({
            url: operationUri,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (brData) {

                //displayAlertDialog('brData:' + brData);

                // First, we have to determine if this is a Budget Request, or a Recurring Expense.
                if (brData.length == 0) {
                    // This means it must be a Recurring Expense. 

                    // Todd: Call a webservice to find the Recurring Expense!!

                    displayAlertDialog('This is a Recurring Expense. We need to display it here. Functionality incomplete, coming soon!');







                } else {
                    // This means it is a Budget Request. Display it based on workflow status!

                    if (brData == 'PERMISSION DENIED') {
                        //displayAlertDialog('You don\'t have permission to view this budget request.');
                        //populateStartPageItem('divWelcome', 'Reports', ''); // This doesn't work, it just goes into a loop because the request id is still in the suery string.

                        //// So we have to remove the "request" parameter from the query string. This seems the only way to do it, which unfortunately makes them login again.
                        //var currentLocation = window.location.toString();
                        //var pos1 = currentLocation.indexOf('?');
                        //var str1 = currentLocation.substring(0, pos1);
                        //window.location = str1 + '?logontype=custom';
                        //hideWorkingOnItDialog();

                        var html = '';
                        html += 'You don\'t have permission to view this budget request.';
                        document.getElementById('spanErrorMessage').innerHTML = html;
                        $("#divAlertDialog").dialog({
                            modal: true,
                            resizable: false,
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            title: 'Alert',
                            width: "720",
                            dialogClass: "no-close", // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function (event, ui) {
                                $('.ui-widget-overlay').bind('click', function () {
                                    $("#divAlertDialog").dialog('close');

                                    // So we have to remove the "request" parameter from the query string. This seems the only way to do it, which unfortunately makes them login again.
                                    var currentLocation = window.location.toString();
                                    var pos1 = currentLocation.indexOf('?');
                                    var str1 = currentLocation.substring(0, pos1);
                                    alert('Setting window.location. xcx213124-1.');
                                    window.location = str1 + '?logontype=custom';

                                });

                                $('#divAlertDialogCloseButton').bind('click', function () {
                                    $("#divAlertDialog").dialog('close');

                                    // So we have to remove the "request" parameter from the query string. This seems the only way to do it, which unfortunately makes them login again.
                                    var currentLocation = window.location.toString();
                                    var pos1 = currentLocation.indexOf('?');
                                    var str1 = currentLocation.substring(0, pos1);
                                    alert('Setting window.location. xcx213124-2.');
                                    window.location = str1 + '?logontype=custom';

                                });
                            } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                        });
                        $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();



                    } else {


                        // We need to get the following from the returned BwBudgetRequest data element.
                        var userId = participantId; //9; //_spPageContextInfo.userId;
                        debugger;
                        var functionalAreaId = brData.BudgetRequests[0].FunctionalAreaId; //1;



                        var pmAccountId = brData.BudgetRequests[0].ManagerId; //9;
                        var managerFriendlyName = brData.BudgetRequests[0].ManagerFriendlyName;
                        var arStatus = brData.BudgetRequests[0].ARStatus; //'Submitted';
                        var workflowStatus = brData.BudgetRequests[0].BudgetWorkflowStatus; //'Assign Budget';
                        var xml = brData.BudgetRequests[0].bwDocumentXml
                        bwApprovalLevelWorkflowToken = brData.BudgetRequests[0].bwApprovalLevelWorkflowToken; // global declared in my.js


                        //displayAlertDialog('arStatus: ' + arStatus);
                        //displayAlertDialog('workflowStatus: ' + workflowStatus);

                        var isSupplementalRequest = brData.BudgetRequests[0].IsSupplementalRequest;
                        if (isSupplementalRequest == 'true') isSupplementalRequest = true;

                        var isRecurringExpense = brData.BudgetRequests[0].IsRecurringExpense;
                        if (isRecurringExpense == 'true') isRecurringExpense = true;

                        var relatedRecurringExpenseId = brData.BudgetRequests[0].RelatedRecurringExpenseId;

                        var file = "";
                        var status = "";

                        if (action == 'Resubmit') {
                            var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
                            try {
                                if (xml == 'undefined') xmlUndefined = true;
                            } catch (e) {
                                // no action necessary.
                            }
                            if ((xml == null) || xmlUndefined) {
                                displayAlertDialog('Error loading the file.');
                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus().Resubmit', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
                                redirectForm();
                            } else {
                                status = "";
                                var xslFile = "";
                                xslFile = "/" + viewsFolderName + "/ResubmitEditForm.xsl";
                                file = appweburl2 + xslFile;
                                status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Enter the necessary details then click the "Submit the AR" button.';
                                var xsl = null;
                                try //Internet Explorer
                                {
                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
                                    xsl.async = false;
                                    xsl.load(file);
                                }
                                catch (e) {
                                    try //Firefox, Mozilla, Opera, etc.
                                    {
                                        xsl = document.implementation.createDocument("", "", null);
                                        xsl.async = false;
                                        xsl.load(file);
                                    }
                                    catch (e) {
                                        try //Google Chrome
                                        {
                                            var xmlhttp = new window.XMLHttpRequest();
                                            xmlhttp.open("GET", file, false);
                                            xmlhttp.send(null);
                                            xsl = xmlhttp.responseXML.documentElement;
                                        }
                                        catch (e) {
                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Resubmit: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                            redirectForm();
                                        }
                                    }
                                }
                                var s = TransformToHtmlText(xml, xsl);
                                $('#myxml').append(s);

                                populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                //$.getScript(scriptbase + "sp.workflowservices.js",
                                //function () {
                                //    initializePeoplePicker('peoplePicker'); // todd put this back at some point
                                //populateYear();
                                //populateCategories();
                                //decodeUriInAllFields();
                                //formatRequestedCapital();
                                //formatRequestedExpense();
                                ////formatBudgetAmount(); 
                                //formatCurrency2('my:Budget_Amount2');
                                //formatCurrency2('my:ExpenseEquipmentAndParts');
                                //formatCurrency2('my:CostOfEquipmentAndParts');
                                //formatCurrency2('my:ExpenseInternalLabor');
                                //formatCurrency2('my:CostOfInternalLabor');
                                //formatCurrency2('my:ExpenseCostOfOutsideServices');
                                //formatCurrency2('my:CostOfOutsideServices');
                                //formatCurrency2('my:OtherExpense');
                                //formatCurrency2('my:OtherCapital');
                                //formatCurrency2('my:SalesTax');
                                //// Get rid of the empty elements in the <ol> tag.
                                //clearEmptyListItems();
                                ////populateAttachments2(true);
                                ////populateArAttachments2(true);
                                //document.getElementById('strProjectTitle').focus();
                                //});
                                //    },
                                //    error: function (data, errorCode, errorMessage) {
                                //        displayAlertDialog('Error accessing the budget requests.');
                                //        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus().Resubmit', 'Error accessing the budget requests: ' + errorCode + ', ' + errorMessage);
                                //        redirectForm();
                                //    }
                                //});
                            }
                        } else if (arStatus == 'Active') {
                            var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
                            try {
                                if (xml == 'undefined') xmlUndefined = true;
                            } catch (e) {
                                // no action necessary.
                            }
                            if ((xml == null) || xmlUndefined) {
                                displayAlertDialog('Error loading the file.');
                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
                                redirectForm();
                            } else {

                                //// Todd: Check if the user has been assigned this task. This will determine if we display the EditForm or the DispForm.
                                //$.ajax({
                                //    url: appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                //    method: "GET",
                                //    headers: { "Accept": "application/json; odata=verbose" },
                                //    success: function (data) {
                                //for (var i = 0; i < data.d.results.length; i++) {
                                //    if (functionalAreaId == data.d.results[i].Id) {
                                //        var userId = _spPageContextInfo.userId;
                                //        var isApprover = false; // Check if the user is an approver.
                                //        // multiple user check. removing for this version
                                //        //var assignBudgetUsers = data.d.results[0].Approver1Id.results;
                                //        //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                //        //    var assignBudgetUserId = assignBudgetUsers[u]; //data.d.results[0].Approver1Id.results[u];
                                //        //    if (assignBudgetUserId == userId) isApprover = true;
                                //        //}
                                //        var assignBudgetUserId = data.d.results[0].Approver1Id;
                                //        if (assignBudgetUserId == userId) isApprover = true;
                                //    }
                                //}
                                //var status = "";
                                //if (isApprover) {
                                //    file = appweburl + "/Pages/Views/AssignBudgetEditForm.xsl";
                                //    status = 'Enter the "Budget Amount", and click the "Save and Approve" button.';
                                //} else {
                                file = appweburl2 + "/" + viewsFolderName + "/IssuePODispForm.xsl";
                                status = 'A Purchase Order number has been issued for this AR.';
                                //}

                                var xsl = null;
                                try //Internet Explorer
                                {
                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
                                    xsl.async = false;
                                    xsl.load(file);
                                }
                                catch (e) {
                                    try //Firefox, Mozilla, Opera, etc.
                                    {
                                        xsl = document.implementation.createDocument("", "", null);
                                        xsl.async = false;
                                        xsl.load(file);
                                    }
                                    catch (e) {
                                        try //Google Chrome
                                        {
                                            var xmlhttp = new window.XMLHttpRequest();
                                            xmlhttp.open("GET", file, false);
                                            xmlhttp.send(null);
                                            xsl = xmlhttp.responseXML.documentElement;
                                        }
                                        catch (e) {
                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'A Purchase Order number has been issued for this AR: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                            redirectForm();
                                        }
                                    }
                                }
                                var s = TransformToHtmlText(xml, xsl);
                                $('#myxml').append(s);

                                var brTitle = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;

                                if (isSupplementalRequest == true) {
                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Supplemental Request: ' + filename.replace('.xml', '');
                                    // ALSO SET THE TITLE
                                    $('#divWelcomeMasterDivTitle').text('Supplemental Request: ' + filename.replace('.xml', ''));

                                    displayRootBudgetRequestOnSupplementalForm();


                                } else {
                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
                                    // ALSO SET THE TITLE

                                    //displayAlertDialog('SET THE TITLE1');

                                    $('#divWelcomeMasterDivTitle').text('Authorization Request: ' + filename.replace('.xml', ''));


                                    // Check if supplementals are enabled.
                                    if (supplementalsEnabled == true) {
                                        var html = '';
                                        html += '<input onclick="cmdCreateSupplementalAr(\'' + budgetRequestId + '\', \'' + functionalAreaId + '\', \'' + pmAccountId + '\', \'' + brTitle + '\');" type="button" name="SupplementalAr" id="btnSupplementalAr" value="New Supplemental Request" class="FormCreateASupplementalRequestButton" />';
                                        document.getElementById('spanCreateSupplementalRequestButtonPlaceholder').innerHTML = html;
                                    }



                                    // Check if closeouts are enabled.
                                    if (closeoutsEnabled == true) {
                                        html = '<input onclick="displayForm_DisplayCloseOut(\'' + budgetRequestId + '\');" type="button" name="Closeout" id="btnCloseout" value="View Closeout" class="FormViewCloseoutButton" />';
                                        document.getElementById('spanViewCloseoutButtonPlaceholder').innerHTML = html;
                                    }

                                    //spanViewCloseoutButtonPlaceholder
                                }




                                displaySupplementalsOnBudgetRequestForm(data);

                                //// Display Supplementals list!
                                //if (data.d.results[1].length > 0) {
                                //    //displayAlertDialog('This BR has supplementals2!!!');
                                //    var html = '';
                                //    html += '<table style="width:100%;">';
                                //    for (var z = 0; z < data.d.results[1].length; z++) {
                                //        if (z == 0) {
                                //            html += ' <tr>';
                                //            html += '    <td>';
                                //            html += '      There are ' + data.d.results[1].length + ' supplemental request(s):<br />';
                                //            html += '    </td>';
                                //            html += '    <td style="width:5%;white-space:nowrap;">';
                                //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                //            html += '    </td>';
                                //            html += '  </tr>';
                                //        } else {
                                //            html += ' <tr>';
                                //            html += '    <td>';
                                //            html += '    </td>';
                                //            html += '    <td style="width:5%;white-space:nowrap;">';
                                //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                //            html += '    </td>';
                                //            html += '  </tr>';
                                //        }
                                //    }
                                //    html += '</table>';
                                //    document.getElementById('spanRelatedRequestsList').innerHTML = html;
                                //}


                                // Format the form.
                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                decodeUriInAllFields();
                                formatRequestedExpense();
                                formatRequestedCapital();
                                //formatBudgetAmount2();
                                formatCurrency2('my:Budget_Amount2');



                                // Check if the $('#dtEstimatedStartDatex').type attribute = "date". If so, it is the iOS .xsl view.
                                if ($('#dtEstimatedStartDatex').attr('type') == 'date') {
                                    // This is an iOS date picker.
                                    document.getElementById('dtEstimatedStartDatex').value = formatMMDDYYYYDateForIos8($('span[xd\\:binding = "my:Estimated_Start_Date"]')[0].innerHTML);
                                    document.getElementById('dtEstimatedEndDatex').value = formatMMDDYYYYDateForIos8($('span[xd\\:binding = "my:Estimated_End_Date"]')[0].innerHTML);
                                    //var dt = document.getElementById('dtEstimatedStartDatex').value;
                                    //displayAlertDialog('The date is: ' + dt);
                                } else {
                                    // This is a NON iOS date picker. I would like to do this with xslt but for now this approach works.
                                    document.getElementById('dtEstimatedStartDatex').value = $('span[xd\\:binding = "my:Estimated_Start_Date"]')[0].innerHTML;
                                    document.getElementById('dtEstimatedEndDatex').value = $('span[xd\\:binding = "my:Estimated_End_Date"]')[0].innerHTML;
                                    // Then we bind the jquery datepicker.
                                    $('#dtEstimatedStartDatex').datepicker();
                                    $('#dtEstimatedEndDatex').datepicker();
                                }


                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                formatCurrency2('my:CostOfEquipmentAndParts');
                                formatCurrency2('my:ExpenseInternalLabor');
                                formatCurrency2('my:CostOfInternalLabor');
                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                formatCurrency2('my:CostOfOutsideServices');
                                formatCurrency2('my:OtherExpense');
                                formatCurrency2('my:OtherCapital');
                                formatCurrency2('my:SalesTax');

                                recalculateCosts();

                                populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
                                //populateAttachments2(false);
                                //populateArAttachments2(false);
                            }
                        } else if (arStatus == 'Approved') {
                            var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
                            try {
                                if (xml == 'undefined') xmlUndefined = true;
                            } catch (e) {
                                // no action necessary.
                            }
                            if ((xml == null) || xmlUndefined) {
                                displayAlertDialog('Error loading the file.');
                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
                                redirectForm();
                            } else {
                                switch (workflowStatus) {
                                    case 'Procurement: Issue PO#':

                                        // We were doing this by passing the bwWorkflowAppId, but this may not always be correct, so we are passing bwBudgetRequestId instead.
                                        //var data = {
                                        //    bwWorkflowAppId: workflowAppId
                                        //};
                                        //$.ajax({
                                        //    url: webserviceurl + "/bwdepartments",
                                        //    type: "DELETE",
                                        //    contentType: 'application/json',
                                        //    data: JSON.stringify(data),
                                        //    success: function (data) {
                                        var data = {
                                            bwBudgetRequestId: budgetRequestId
                                        };
                                        $.ajax({
                                            url: webserviceurl + "/bwdepartmentsforbudgetrequestid",
                                            type: "DELETE",
                                            contentType: 'application/json',
                                            data: JSON.stringify(data),
                                            success: function (data) {
                                                //displayAlertDialog('webserviceurl:' + webserviceurl);
                                                //displayAlertDialog('data:' + JSON.stringify(data));
                                                //if (data.length > 0) {
                                                //    for (var i = 0; i < data.length; i++) {
                                                //        if (data[i].bwDepartmentTitle == 'Procurement') {
                                                //            $('#txtBwDepartmentUserName').val(data[i].bwDepartmentUserName);
                                                //            $('#txtBwDepartmentUserId').val(data[i].bwDepartmentUserId);
                                                // Create the button.



                                                //$.ajax({
                                                //    url: webserviceurl + "/_api/web/lists/getbytitle('Departments')/items",
                                                //    method: "GET",
                                                //    headers: { "Accept": "application/json; odata=verbose" },
                                                //    success: function (data) {
                                                var procurementUserId;
                                                for (var i = 0; i < data.length; i++) {
                                                    if ("Procurement" == data[i].bwDepartmentTitle) {
                                                        var isApprover = false; // Check if the user is an approver.
                                                        procurementUserId = data[i].bwDepartmentUserId;
                                                        if (procurementUserId == userId) isApprover = true;
                                                    }
                                                }


                                                //displayAlertDialog('procurementUserId: ' + procurementUserId);

                                                var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + procurementUserId;
                                                $.ajax({
                                                    url: operationUri, //appweburl + "/_api/web/GetUserById(" + assignBudgetUserId + ")",
                                                    method: "GET",
                                                    headers: { "Accept": "application/json; odata=verbose" },
                                                    success: function (data) {


                                                        //$.ajax({
                                                        //    url: webserviceurl + "/_api/web/GetUserById(" + procurementUserId + ")",
                                                        //    method: "GET",
                                                        //    headers: { "Accept": "application/json; odata=verbose" },
                                                        //    success: function (data) {
                                                        status = "";
                                                        var xslFile = "";
                                                        if (isApprover) {
                                                            xslFile = "/" + viewsFolderName + "/IssuePOEditForm.xsl";
                                                            file = appweburl2 + xslFile;
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Enter the Purchase Order Number then click the "Assign PO#" button.';
                                                        } else {
                                                            xslFile = "/" + viewsFolderName + "/IssuePODispForm.xsl";
                                                            file = appweburl2 + xslFile;

                                                            //displayAlertDialog('bwParticipantFriendlyName:' + data.d.results[0].bwParticipantFriendlyName);
                                                            //displayAlertDialog('bwParticipantFriendlyName: ' + JSON.stringify(data));

                                                            status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to issue the PO#.';
                                                        }

                                                        var xsl = null;
                                                        try //Internet Explorer
                                                        {
                                                            xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Firefox, Mozilla, Opera, etc.
                                                            {
                                                                xsl = document.implementation.createDocument("", "", null);
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Google Chrome
                                                                {
                                                                    var xmlhttp = new window.XMLHttpRequest();
                                                                    xmlhttp.open("GET", file, false);
                                                                    xmlhttp.send(null);
                                                                    xsl = xmlhttp.responseXML.documentElement;
                                                                }
                                                                catch (e) {
                                                                    displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Procurement: Issue PO#: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                    redirectForm();
                                                                }
                                                            }
                                                        }
                                                        var s = TransformToHtmlText(xml, xsl);
                                                        $('#myxml').append(s);

                                                        try {
                                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                            decodeUriInAllFields();
                                                            formatRequestedExpense();
                                                            formatRequestedCapital();
                                                            formatCurrency2('my:Budget_Amount2');

                                                            //formatStartAndEndDates();

                                                            formatCurrency2('my:ExpenseEquipmentAndParts');
                                                            formatCurrency2('my:CostOfEquipmentAndParts');
                                                            formatCurrency2('my:ExpenseInternalLabor');
                                                            formatCurrency2('my:CostOfInternalLabor');
                                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                            formatCurrency2('my:CostOfOutsideServices');
                                                            formatCurrency2('my:OtherExpense');
                                                            formatCurrency2('my:OtherCapital');
                                                            formatCurrency2('my:SalesTax');
                                                            recalculateCosts();

                                                            //if (xslFile === "/" + viewsFolderName + "/IssuePOEditForm.xsl") {
                                                            //    // Get rid of the empty elements in the <ol> tag.
                                                            //    clearEmptyListItems();
                                                            //}

                                                            if (file.indexOf('IssuePOEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                        } catch (e) {
                                                            displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                        }
                                                    },
                                                    error: function (data, errorCode, errorMessage) {
                                                        //window.waitDialog.close();
                                                        displayAlertDialog('Error retrieving procurement user display name.');
                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving procurement user display name: ' + errorCode + ', ' + errorMessage);
                                                    }
                                                });
                                            },
                                            error: function (data, errorCode, errorMessage) {
                                                displayAlertDialog('Error accessing Departments.');
                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                redirectForm();
                                            }
                                        });
                                        break;
                                    case 'PO# Issued':
                                        file = appweburl2 + "/" + viewsFolderName + "/IssuePODispForm.xsl";
                                        status = 'The PO# has been assigned for this AR.';
                                        var xsl = null;
                                        try //Internet Explorer
                                        {
                                            xsl = new ActiveXObject("Microsoft.XMLDOM");
                                            xsl.async = false;
                                            xsl.load(file);
                                        }
                                        catch (e) {
                                            try //Firefox, Mozilla, Opera, etc.
                                            {
                                                xsl = document.implementation.createDocument("", "", null);
                                                xsl.async = false;
                                                xsl.load(file);
                                            }
                                            catch (e) {
                                                try //Google Chrome
                                                {
                                                    var xmlhttp = new window.XMLHttpRequest();
                                                    xmlhttp.open("GET", file, false);
                                                    xmlhttp.send(null);
                                                    xsl = xmlhttp.responseXML.documentElement;
                                                }
                                                catch (e) {
                                                    displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The PO# has been issued for this AR: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                    redirectForm();
                                                }
                                            }
                                        }
                                        //xmlDoc = xml;
                                        var s = TransformToHtmlText(xml, xsl);
                                        $('#myxml').append(s);

                                        try {
                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                            decodeUriInAllFields();
                                            formatRequestedExpense();
                                            formatRequestedCapital();

                                            //formatBudgetAmount(); // Todd which do we need?


                                            formatCurrency2('my:Budget_Amount2');

                                            //formatStartAndEndDates();

                                            formatCurrency2('my:ExpenseEquipmentAndParts');
                                            formatCurrency2('my:CostOfEquipmentAndParts');
                                            formatCurrency2('my:ExpenseInternalLabor');
                                            formatCurrency2('my:CostOfInternalLabor');
                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
                                            formatCurrency2('my:CostOfOutsideServices');
                                            formatCurrency2('my:OtherExpense');
                                            formatCurrency2('my:OtherCapital');
                                            formatCurrency2('my:SalesTax');
                                            recalculateCosts();

                                            populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                        } catch (e) {
                                            displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                        }
                                        break;
                                    case 'Issue PO#: Additional Info Needed':
                                        var isApprover = false; // Check if the user is an approver.
                                        $.ajax({
                                            url: webserviceurl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                            method: "GET",
                                            headers: { "Accept": "application/json; odata=verbose" },
                                            success: function (data) {
                                                //var userId = _spPageContextInfo.userId;
                                                var pmUserId = data.d.Id;
                                                if (pmUserId == userId) isApprover = true;
                                                //var userDisplayName = data.d.Title; // Display Name.
                                                status = "";
                                                if (isApprover) {
                                                    file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                    if (Platform == 'IOS8') {
                                                        status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                    } else {
                                                        status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                    }
                                                } else {
                                                    file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                    status = 'Waiting for additional information to be added to the AR by ' + data.d.Title + '.';
                                                }

                                                var xsl = null;
                                                try //Internet Explorer
                                                {
                                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                    xsl.async = false;
                                                    xsl.load(file);
                                                }
                                                catch (e) {
                                                    try //Firefox, Mozilla, Opera, etc.
                                                    {
                                                        xsl = document.implementation.createDocument("", "", null);
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Google Chrome
                                                        {
                                                            var xmlhttp = new window.XMLHttpRequest();
                                                            xmlhttp.open("GET", file, false);
                                                            xmlhttp.send(null);
                                                            xsl = xmlhttp.responseXML.documentElement;
                                                        }
                                                        catch (e) {
                                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Issue PO#: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                            redirectForm();
                                                        }
                                                    }
                                                }
                                                var s = TransformToHtmlText(xml, xsl);
                                                $('#myxml').append(s);

                                                try {
                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                    decodeUriInAllFields();
                                                    formatRequestedExpense();
                                                    formatRequestedCapital();
                                                    formatCurrency2('my:Budget_Amount2');
                                                    //formatBudgetAmount();

                                                    if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
                                                    formatCurrency2('my:CostOfEquipmentAndParts');
                                                    formatCurrency2('my:ExpenseInternalLabor');
                                                    formatCurrency2('my:CostOfInternalLabor');
                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                    formatCurrency2('my:CostOfOutsideServices');
                                                    formatCurrency2('my:OtherExpense');
                                                    formatCurrency2('my:OtherCapital');
                                                    formatCurrency2('my:SalesTax');
                                                    recalculateCosts();



                                                    if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                } catch (e) {
                                                    displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                }
                                            },
                                            error: function (data, errorCode, errorMessage) {
                                                displayAlertDialog('Error looking up PM User Id.');
                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                redirectForm();
                                            }
                                        });
                                        break;
                                    default:
                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                        status = 'This AR has been approved.';

                                        console.log('In bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus2().default. Not sure why default was chosen, is the status unknown? It (workflowStatus) is: ' + workflowStatus + '. Status forced to: ' + status);

                                        var xsl = null;
                                        try //Internet Explorer
                                        {
                                            xsl = new ActiveXObject("Microsoft.XMLDOM");
                                            xsl.async = false;
                                            xsl.load(file);
                                        }
                                        catch (e) {
                                            try //Firefox, Mozilla, Opera, etc.
                                            {
                                                xsl = document.implementation.createDocument("", "", null);
                                                xsl.async = false;
                                                xsl.load(file);
                                            }
                                            catch (e) {
                                                try //Google Chrome
                                                {
                                                    var xmlhttp = new window.XMLHttpRequest();
                                                    xmlhttp.open("GET", file, false);
                                                    xmlhttp.send(null);
                                                    xsl = xmlhttp.responseXML.documentElement;
                                                }
                                                catch (e) {
                                                    displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The AR has been approved: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                    redirectForm();
                                                }
                                            }
                                        }
                                        var s = TransformToHtmlText(xml, xsl);
                                        $('#myxml').append(s);

                                        try {
                                            var brTitle = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;


                                            if (isRecurringExpense == true) {
                                                //displayAlertDialog('isRecurringExpense: ' + isRecurringExpense);
                                                var html = '';
                                                html += 'This request was generated from a recurring expense: <a href="">' + relatedRecurringExpenseId + '</a>';
                                                document.getElementById('spanRelatedRequestsList').innerHTML = html;
                                            }

                                            if (isSupplementalRequest == true) {
                                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Supplemental Request: ' + filename.replace('.xml', '');
                                                // ALSO SET THE TITLE
                                                $('#divWelcomeMasterDivTitle').text('Supplemental Request: ' + filename.replace('.xml', ''));

                                                displayRootBudgetRequestOnSupplementalForm();
                                            } else {
                                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
                                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
                                                // ALSO SET THE TITLE

                                                //displayAlertDialog('SET THE TITLE2');

                                                $('#divWelcomeMasterDivTitle').text('Authorization Request: ' + brTitle); //filename.replace('.xml', ''));

                                                // Check if supplementals are enabled.
                                                if (supplementalsEnabled == true) {
                                                    displaySupplementalsOnBudgetRequestForm(brData);

                                                    var html = '';
                                                    html += '<input onclick="cmdCreateSupplementalAr(\'' + budgetRequestId + '\', \'' + functionalAreaId + '\', \'' + pmAccountId + '\', \'' + brTitle + '\');" type="button" name="SupplementalAr" id="btnSupplementalAr" value="New Supplemental Request" class="FormCreateASupplementalRequestButton" />';
                                                    document.getElementById('spanCreateSupplementalRequestButtonPlaceholder').innerHTML = html;
                                                }


                                                // Check if closeouts are enabled.
                                                if (closeoutsEnabled == true) {
                                                    html = '<input onclick="displayForm_DisplayCloseOut(\'' + budgetRequestId + '\');" type="button" name="Closeout" id="btnCloseout" value="View Closeout" class="FormViewCloseoutButton" />';
                                                    document.getElementById('spanViewCloseoutButtonPlaceholder').innerHTML = html;
                                                }

                                                //spanViewCloseoutButtonPlaceholder
                                            }

                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                            decodeUriInAllFields();
                                            formatRequestedExpense();
                                            formatRequestedCapital();
                                            formatCurrency2('my:Budget_Amount2');

                                            formatStartAndEndDates();

                                            formatCurrency2('my:ExpenseEquipmentAndParts');
                                            formatCurrency2('my:CostOfEquipmentAndParts');
                                            formatCurrency2('my:ExpenseInternalLabor');
                                            formatCurrency2('my:CostOfInternalLabor');
                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
                                            formatCurrency2('my:CostOfOutsideServices');
                                            formatCurrency2('my:OtherExpense');
                                            formatCurrency2('my:OtherCapital');
                                            formatCurrency2('my:SalesTax');

                                            recalculateCosts();

                                            populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                        } catch (e) {
                                            displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                        }

                                        //displayAlertDialog('DO WE NEED TO ADD THE ONCLICK TO THE DETAILS BUTTON HERE1');
                                        $('#btnDetails').off('click').click(function (error) {
                                            var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;
                                            var projectTitle = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML;
                                            displayArInDialog(appweburl, budgetRequestId, budgetRequestId, projectTitle, title);
                                        });

                                        // WE NEED TO ADD THE "Create Supplemental Request" button here.

                                        // <input onclick="cmdCreateSupplementalAr();" type="button" name="SupplementalAr" id="btnSupplementalAr" value="Create a Supplemental Request" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 230px; cursor:pointer;"/>


                                        //var html = '';
                                        //html += '<input onclick="cmdCreateSupplementalAr(\'' + budgetRequestId + '\', \'' + functionalAreaId + '\', \'' + pmAccountId + '\');" type="button" name="SupplementalAr" id="btnSupplementalAr" value="Create a Supplemental Request" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 230px; cursor:pointer;"/>';
                                        //document.getElementById('spanCreateSupplementalRequestButtonPlaceholder').innerHTML = html;



                                        //// Display Supplementals list!
                                        //if (data.d.results[1].length > 0) {
                                        //    //displayAlertDialog('This BR has supplementals2!!!');
                                        //    var html = '';
                                        //    html += '<table style="width:100%;">';
                                        //    for (var z = 0; z < data.d.results[1].length; z++) {
                                        //        if (z == 0) {
                                        //            html += ' <tr>';
                                        //            html += '    <td>';
                                        //            html += '      There are ' + data.d.results[1].length + ' supplemental request(s):<br />';
                                        //            html += '    </td>';
                                        //            html += '    <td style="width:5%;white-space:nowrap;">';
                                        //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                        //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                        //            html += '    </td>';
                                        //            html += '  </tr>';
                                        //        } else {
                                        //            html += ' <tr>';
                                        //            html += '    <td>';
                                        //            html += '    </td>';
                                        //            html += '    <td style="width:5%;white-space:nowrap;">';
                                        //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                        //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
                                        //            html += '    </td>';
                                        //            html += '  </tr>';
                                        //        }
                                        //    }
                                        //    html += '</table>';
                                        //    document.getElementById('spanRelatedRequestsList').innerHTML = html;
                                        //}

                                        break;
                                }
                            }
                        } else if (arStatus == 'Quote Approved') {
                            var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
                            try {
                                if (xml == 'undefined') xmlUndefined = true;
                            } catch (e) {
                                // no action necessary.
                            }
                            if ((xml == null) || xmlUndefined) {
                                displayAlertDialog('Error loading the file.');
                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
                                redirectForm();
                            } else {
                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                status = 'This AR has been approved.';
                                var xsl = null;
                                try //Internet Explorer
                                {
                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
                                    xsl.async = false;
                                    xsl.load(file);
                                }
                                catch (e) {
                                    try //Firefox, Mozilla, Opera, etc.
                                    {
                                        xsl = document.implementation.createDocument("", "", null);
                                        xsl.async = false;
                                        xsl.load(file);
                                    }
                                    catch (e) {
                                        try //Google Chrome
                                        {
                                            var xmlhttp = new window.XMLHttpRequest();
                                            xmlhttp.open("GET", file, false);
                                            xmlhttp.send(null);
                                            xsl = xmlhttp.responseXML.documentElement;
                                        }
                                        catch (e) {
                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The AR has been approved: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                            redirectForm();
                                        }
                                    }
                                }
                                var s = TransformToHtmlText(xml, xsl);
                                $('#myxml').append(s);

                                try {
                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                    decodeUriInAllFields();
                                    formatRequestedExpense();
                                    formatRequestedCapital();
                                    formatCurrency2('my:Budget_Amount2');
                                    //  formatBudgetAmount();

                                    //formatStartAndEndDates();

                                    formatCurrency2('my:ExpenseEquipmentAndParts');
                                    formatCurrency2('my:CostOfEquipmentAndParts');
                                    formatCurrency2('my:ExpenseInternalLabor');
                                    formatCurrency2('my:CostOfInternalLabor');
                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
                                    formatCurrency2('my:CostOfOutsideServices');
                                    formatCurrency2('my:OtherExpense');
                                    formatCurrency2('my:OtherCapital');
                                    formatCurrency2('my:SalesTax');
                                    recalculateCosts();

                                    populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                } catch (e) {
                                    displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                }

                                //displayAlertDialog('DO WE NEED TO ADD THE ONCLICK TO THE DETAILS BUTTON HERE2');
                                $('#btnDetails').off('click').click(function (error) {
                                    var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;
                                    var projectTitle = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML;
                                    displayArInDialog(appweburl, budgetRequestId, budgetRequestId, projectTitle, title);
                                });

                            }
                        } else if (arStatus == 'Rejected') {
                            var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
                            try {
                                if (xml == 'undefined') xmlUndefined = true;
                            } catch (e) {
                                // no action necessary.
                            }
                            if ((xml == null) || xmlUndefined) {
                                displayAlertDialog('Error loading the file.');
                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
                                redirectForm();
                            } else {
                                //file = appweburl + "/Pages/Views/BudgetApprovalDispForm.xsl";
                                file = appweburl2 + "/" + viewsFolderName + "/ResubmitDispForm.xsl";
                                status = 'This AR has been rejected.';
                                var xsl = null;
                                try //Internet Explorer
                                {
                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
                                    xsl.async = false;
                                    xsl.load(file);
                                }
                                catch (e) {
                                    try //Firefox, Mozilla, Opera, etc.
                                    {
                                        xsl = document.implementation.createDocument("", "", null);
                                        xsl.async = false;
                                        xsl.load(file);
                                    }
                                    catch (e) {
                                        try //Google Chrome
                                        {
                                            var xmlhttp = new window.XMLHttpRequest();
                                            xmlhttp.open("GET", file, false);
                                            xmlhttp.send(null);
                                            xsl = xmlhttp.responseXML.documentElement;
                                        }
                                        catch (e) {
                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The AR has been rejected: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                            redirectForm();
                                        }
                                    }
                                }
                                //xmlDoc = xml;
                                var s = TransformToHtmlText(xml, xsl);
                                $('#myxml').append(s);

                                try {
                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                    decodeUriInAllFields();
                                    formatRequestedExpense();
                                    formatRequestedCapital();
                                    formatCurrency2('my:Budget_Amount2');
                                    // formatBudgetAmount();

                                    //formatStartAndEndDates();

                                    formatCurrency2('my:ExpenseEquipmentAndParts');
                                    formatCurrency2('my:CostOfEquipmentAndParts');
                                    formatCurrency2('my:ExpenseInternalLabor');
                                    formatCurrency2('my:CostOfInternalLabor');
                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
                                    formatCurrency2('my:CostOfOutsideServices');
                                    formatCurrency2('my:OtherExpense');
                                    formatCurrency2('my:OtherCapital');
                                    formatCurrency2('my:SalesTax');
                                    recalculateCosts();

                                    populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                } catch (e) {
                                    displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                }

                            }
                        } else if (arStatus == 'Submitted') {
                            debugger;
                            if (workflowStatus != null) {
                                //loadXML(appweburl + '/Lists/BudgetRequests/' + filename, function (xml) { // THIS IS OLD
                                //loadXML(appweburl + "/_api/web/lists/getbytitle('BudgetRequests')/GetItems/" + filename, function (xml) { // THIS WORKS WITH A STATIC FILE
                                //loadXML(appweburl + "/bwbudgetrequests/" + filename, function (xml) { // filename is the guid of the BR
                                var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
                                try {
                                    if (xml == 'undefined') xmlUndefined = true;
                                } catch (e) {
                                    // no action necessary.
                                }
                                if ((xml == null) || xmlUndefined) {
                                    displayAlertDialog('Error loading the file.');
                                    //WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
                                    //redirectForm();
                                } else {
                                    switch (workflowStatus) {
                                        case 'Assign Budget':
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var assignBudgetUserId = null;
                                                    //displayAlertDialog(JSON.stringify(data));
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver1Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; //data.d.results[0].Approver1Id.results[u];
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            assignBudgetUserId = data.d.results[i].Approver1Id;
                                                            if (assignBudgetUserId == userId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + assignBudgetUserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + assignBudgetUserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            var file;
                                                            status = "";
                                                            if (isApprover) {
                                                                //file = appweburl + "/Pages/Views/AssignBudgetEditForm.xsl";
                                                                //displayAlertDialog('editform');
                                                                file = appweburl2 + "/" + viewsFolderName + "/AssignBudgetEditForm.xsl";
                                                                status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Enter the "Budget Amount" then click the "Save and Approve" button.';
                                                            } else {
                                                                //file = appweburl + "/Pages/Views/AssignBudgetDispForm.xsl";
                                                                //displayAlertDialog('dispform');
                                                                file = appweburl2 + "/" + viewsFolderName + "/AssignBudgetDispForm.xsl";
                                                                status = 'Waiting for the Budget Amount to be assigned by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Assign Budget: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }

                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                if (supplementalsEnabled == true) {
                                                                    if (isSupplementalRequest == true) {
                                                                        displayRootBudgetRequestOnSupplementalForm(brData);
                                                                    }
                                                                }

                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                if (file.indexOf('AssignBudgetEditForm.xsl') > -1) formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
                                                                //displayAlertDialog('enableNewRequestAttachments: ' + enableNewRequestAttachments);
                                                                if (enableNewRequestAttachments == true) {
                                                                    //displayAlertDialog('file: ' + file);
                                                                    // The following is an ugly way to determine if the "showRemoveAttachmentButton" flag is true or false.
                                                                    if (file.indexOf('AssignBudgetEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                                } else {
                                                                    document.getElementById('attachmentsInXslForm').innerHTML = '<span style="font-size:20pt;">[<i>enableNewRequestAttachments has been set to false</i>]</span>';
                                                                }

                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }



                                                            // This has a drop down because the person assigning the budget may want to change the financial area.
                                                            if (file.indexOf('AssignBudgetEditForm.xsl') > -1) {
                                                                // We are still calling it a Budget Request at this stage (before it is created as an AR).
                                                                var titleBarText = $('#divWelcomeMasterDivTitle').text();
                                                                titleBarText = titleBarText.replace('Authorization Request:', 'Budget Request:');
                                                                $('#divWelcomeMasterDivTitle').text(titleBarText);
                                                                //
                                                                populateFunctionalAreasForAssignBudgetEditForm();
                                                            }

                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #1 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_AssignBudget()', 'Error retrieving Approver #1 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Creating the AR':
                                            var isApprover = false; // Check if the user is an approver.
                                            //var operationUri = appweburl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
                                            //$.ajax({
                                            //    url: operationUri,
                                            //    method: "GET",
                                            //    headers: { "Accept": "application/json; odata=verbose" },
                                            //    success: function (brData) {
                                            //var userId = participantId;
                                            //var pmUserId = brData[0].ManagerId;
                                            if (pmAccountId == participantId) isApprover = true;
                                            status = "";
                                            var xslFile = "";
                                            var file;

                                            if (isApprover) {
                                                xslFile = "/" + viewsFolderName + "/CreateArEditForm.xsl";
                                                file = appweburl2 + xslFile;
                                                status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Enter the necessary details then click the "Submit the AR" button.';
                                            } else {
                                                xslFile = "/" + viewsFolderName + "/CreateArDispForm.xsl";
                                                file = appweburl2 + xslFile;
                                                status = 'Waiting for ' + managerFriendlyName + ' to create the AR.'; // todd 5-6-17
                                            }
                                            var xsl = null;
                                            try //Internet Explorer
                                            {
                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                xsl.async = false;
                                                xsl.load(file);
                                            }
                                            catch (e) {
                                                try //Firefox, Mozilla, Opera, etc.
                                                {
                                                    xsl = document.implementation.createDocument("", "", null);
                                                    xsl.async = false;
                                                    xsl.load(file);
                                                }
                                                catch (e) {
                                                    try //Google Chrome
                                                    {
                                                        var xmlhttp = new window.XMLHttpRequest();
                                                        xmlhttp.open("GET", file, false);
                                                        xmlhttp.send(null);
                                                        xsl = xmlhttp.responseXML.documentElement;
                                                    }
                                                    catch (e) {
                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Creating the AR: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                        redirectForm();
                                                    }
                                                }
                                            }
                                            var s = TransformToHtmlText(xml, xsl);
                                            $('#myxml').append(s);

                                            try {
                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                decodeUriInAllFields();
                                                formatRequestedExpense();
                                                formatRequestedCapital();
                                                formatCurrency2('my:Budget_Amount2');

                                                if (xslFile.indexOf('CreateArEditForm.xsl') > -1) formatStartAndEndDates();

                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                formatCurrency2('my:ExpenseInternalLabor');
                                                formatCurrency2('my:CostOfInternalLabor');
                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                formatCurrency2('my:CostOfOutsideServices');
                                                formatCurrency2('my:OtherExpense');
                                                formatCurrency2('my:OtherCapital');
                                                formatCurrency2('my:SalesTax');
                                                recalculateCosts();

                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                if (xslFile.indexOf('CreateArEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

                                                if (xslFile.indexOf('CreateArEditForm.xsl') > -1) {
                                                    // Get rid of the empty elements in the <ol> tag.
                                                    clearEmptyListItems();
                                                }

                                            } catch (e) {
                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                            }

                                            break;
                                        case 'Approval 1: Review AR':
                                            //var operationUri = appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items";
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri,
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval2UserId;
                                                    //var userId = participantId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; 
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            approval2UserId = data.d.results[i].Approver2Id;
                                                            if (approval2UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval2UserId;
                                                    $.ajax({
                                                        url: operationUri,
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Approve or Reject this AR by clicking one of the buttons below.';
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 2: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            //xmlDoc = xml;
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #2 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #2 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 2: Review AR':// Finance Manager(s)
                                            //displayAlertDialog('Approval 3: Review AR');
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval3UserId;
                                                    //displayAlertDialog(JSON.stringify(data));
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            approval3UserId = data.d.results[i].Approver3Id;
                                                            if (approval3UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    //displayAlertDialog('approval3UserId: ' + approval3UserId);
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval3UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval3UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }
                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            } catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                } catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    } catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 3: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #3 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #3 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 3: Review AR':
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval4UserId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            approval4UserId = data.d.results[i].Approver4Id;
                                                            if (approval4UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval4UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval4UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 4: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #4 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #4 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 4: Review AR':// Finance Director(s)
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval5UserId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; 
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            approval5UserId = data.d.results[i].Approver5Id;
                                                            if (approval5UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval5UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval5UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 5: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            //xmlDoc = xml;
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #5 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #5 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 5: Review AR':// Corporate Finance Director(s)
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval6UserId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; 
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            approval6UserId = data.d.results[i].Approver6Id;
                                                            if (approval6UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval6UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval6UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 6: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            //xmlDoc = xml;
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #6 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #6 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 6: Review AR':// Corporate General Manager(s)
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval7UserId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; 
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            approval7UserId = data.d.results[i].Approver7Id;
                                                            if (approval7UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval7UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval7UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 7: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            //xmlDoc = xml;
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #7 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #7 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 7: Review AR':// CFO
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval8UserId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; 
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            approval8UserId = data.d.results[i].Approver8Id;
                                                            if (approval8UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval8UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval8UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 8: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            //xmlDoc = xml;
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #8 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #8 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 8: Review AR':// CEO
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval9UserId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; 
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            approval9UserId = data.d.results[i].Approver9Id;
                                                            if (approval9UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval9UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval9UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 9: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            //xmlDoc = xml;
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #9 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #9 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 9: Review AR'://BOD
                                            var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    var approval10UserId;
                                                    for (var i = 0; i < data.d.results.length; i++) {
                                                        if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
                                                            //var userId = _spPageContextInfo.userId;
                                                            var isApprover = false; // Check if the user is an approver.
                                                            // multiple user check. removing for this version
                                                            //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
                                                            //for (var u = 0; u < assignBudgetUsers.length; u++) {
                                                            //    var assignBudgetUserId = assignBudgetUsers[u]; 
                                                            //    if (assignBudgetUserId == userId) isApprover = true;
                                                            //}
                                                            approval10UserId = data.d.results[i].Approver10Id;
                                                            if (approval10UserId == participantId) isApprover = true;
                                                        }
                                                    }
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval10UserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval10UserId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
                                                                status = "Approve or Reject this AR by clicking one of the buttons below.";
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
                                                                status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 10: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            //xmlDoc = xml;
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                //formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                //if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

                                                                if (file.indexOf('BudgetApprovalEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving Approver #10 display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #10 display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing functional areas.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;

                                        case 'Assign Budget: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
                                            $.ajax({
                                                url: operationUri,
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (brData) {
                                                    var initiatorId = brData.d.results[0][0].CreatedById;
                                                    if (initiatorId == participantId) isApprover = true;
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + initiatorId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + initiatorId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                                if (Platform == 'IOS8') {
                                                                    status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                                } else {
                                                                    status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                                }
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 1: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving the Initiator display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving the Initiator display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing the budget request.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing the budget request.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Creating the AR: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
                                            $.ajax({
                                                url: operationUri,
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (brData) {
                                                    var initiatorId = brData.d.results[0][0].CreatedById;
                                                    if (initiatorId == participantId) isApprover = true;
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + initiatorId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/GetUserById(" + initiatorId + ")",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                                if (Platform == 'IOS8') {
                                                                    status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                                } else {
                                                                    status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                                }
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Create AR: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            //window.waitDialog.close();
                                                            displayAlertDialog('Error retrieving the Initiator display name.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving the Initiator display name: ' + errorCode + ', ' + errorMessage);
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing the budget request.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing the budget request.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 1: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
                                            $.ajax({
                                                url: operationUri,
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (brData) {
                                                    var pmUserId = brData.d.results[0][0].ManagerId;
                                                    if (pmUserId == participantId) isApprover = true;
                                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmUserId;
                                                    $.ajax({
                                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                        method: "GET",
                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                        success: function (data) {
                                                            status = "";
                                                            var file;
                                                            if (isApprover) {
                                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                                if (Platform == 'IOS8') {
                                                                    status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                                } else {
                                                                    status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                                }
                                                            } else {
                                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                            }

                                                            var xsl = null;
                                                            try //Internet Explorer
                                                            {
                                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                                xsl.async = false;
                                                                xsl.load(file);
                                                            }
                                                            catch (e) {
                                                                try //Firefox, Mozilla, Opera, etc.
                                                                {
                                                                    xsl = document.implementation.createDocument("", "", null);
                                                                    xsl.async = false;
                                                                    xsl.load(file);
                                                                }
                                                                catch (e) {
                                                                    try //Google Chrome
                                                                    {
                                                                        var xmlhttp = new window.XMLHttpRequest();
                                                                        xmlhttp.open("GET", file, false);
                                                                        xmlhttp.send(null);
                                                                        xsl = xmlhttp.responseXML.documentElement;
                                                                    }
                                                                    catch (e) {
                                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 2: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                        redirectForm();
                                                                    }
                                                                }
                                                            }
                                                            var s = TransformToHtmlText(xml, xsl);
                                                            $('#myxml').append(s);

                                                            try {
                                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                                decodeUriInAllFields();
                                                                formatRequestedExpense();
                                                                formatRequestedCapital();
                                                                formatCurrency2('my:Budget_Amount2');

                                                                if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                                formatCurrency2('my:ExpenseEquipmentAndParts');
                                                                formatCurrency2('my:CostOfEquipmentAndParts');
                                                                formatCurrency2('my:ExpenseInternalLabor');
                                                                formatCurrency2('my:CostOfInternalLabor');
                                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                                formatCurrency2('my:CostOfOutsideServices');
                                                                formatCurrency2('my:OtherExpense');
                                                                formatCurrency2('my:OtherCapital');
                                                                formatCurrency2('my:SalesTax');
                                                                recalculateCosts();

                                                                if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                            } catch (e) {
                                                                displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                            }
                                                        },
                                                        error: function (data, errorCode, errorMessage) {
                                                            displayAlertDialog('Error looking up PM User Id.');
                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                            redirectForm();
                                                        }
                                                    });
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error accessing the budget request.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing the budget request.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 2: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    //var userId = _spPageContextInfo.userId;
                                                    //var pmUserId = data.d.Id;
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    //var userDisplayName = data.d.Title; // Display Name.
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 3: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 3: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 4: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 4: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 5: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 5: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 6: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 6: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 7: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 7: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 8: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 8: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 9: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        case 'Approval 9: Additional Info Needed':
                                            var isApprover = false; // Check if the user is an approver.
                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
                                            $.ajax({
                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
                                                method: "GET",
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (data) {
                                                    if (pmAccountId == participantId) isApprover = true;
                                                    status = "";
                                                    var file;
                                                    if (isApprover) {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
                                                        if (Platform == 'IOS8') {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested.<br />Modify the details and re-submit the AR for approval.';
                                                        } else {
                                                            status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Additional information has been requested. Modify the details and re-submit the AR for approval.';
                                                        }
                                                    } else {
                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
                                                    }

                                                    var xsl = null;
                                                    try //Internet Explorer
                                                    {
                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                                                        xsl.async = false;
                                                        xsl.load(file);
                                                    }
                                                    catch (e) {
                                                        try //Firefox, Mozilla, Opera, etc.
                                                        {
                                                            xsl = document.implementation.createDocument("", "", null);
                                                            xsl.async = false;
                                                            xsl.load(file);
                                                        }
                                                        catch (e) {
                                                            try //Google Chrome
                                                            {
                                                                var xmlhttp = new window.XMLHttpRequest();
                                                                xmlhttp.open("GET", file, false);
                                                                xmlhttp.send(null);
                                                                xsl = xmlhttp.responseXML.documentElement;
                                                            }
                                                            catch (e) {
                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 10: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack); // todd make sure this matches the case statement text.
                                                                redirectForm();
                                                            }
                                                        }
                                                    }
                                                    var s = TransformToHtmlText(xml, xsl);
                                                    $('#myxml').append(s);

                                                    try {
                                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;

                                                        decodeUriInAllFields();
                                                        formatRequestedExpense();
                                                        formatRequestedCapital();
                                                        formatCurrency2('my:Budget_Amount2');

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) formatStartAndEndDates();

                                                        formatCurrency2('my:ExpenseEquipmentAndParts');
                                                        formatCurrency2('my:CostOfEquipmentAndParts');
                                                        formatCurrency2('my:ExpenseInternalLabor');
                                                        formatCurrency2('my:CostOfInternalLabor');
                                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
                                                        formatCurrency2('my:CostOfOutsideServices');
                                                        formatCurrency2('my:OtherExpense');
                                                        formatCurrency2('my:OtherCapital');
                                                        formatCurrency2('my:SalesTax');
                                                        recalculateCosts();

                                                        if (file.indexOf('AdditionalInformationEditForm.xsl') > -1) populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
                                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
                                                    } catch (e) {
                                                        displayAlertDialog('Error rendering ' + file + '. ' + e.message + e.stack);
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    displayAlertDialog('Error looking up PM User Id.');
                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
                                                    redirectForm();
                                                }
                                            });
                                            break;
                                        default:
                                            displayAlertDialog('The workflow is in an invalid state. Try again in a couple of minutes.');
                                            //WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The workflow is in an invalid state. Try again in a couple of minutes. 001');
                                            redirectForm(appweburl);
                                    }
                                }
                                //});
                            }

                        } else {
                            displayAlertDialog('The workflow is in an invalid state. Try again in a couple of minutes.');
                            //WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The workflow is in an invalid state. Try again in a couple of minutes. 002');
                            redirectForm(appweburl);
                        }
                    }
                }
            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus():1: ' + errorCode + ', ' + errorMessage + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(data));
            }
        });
    } catch (e) {
        //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '2:' + e.message);
        displayAlertDialog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus():2: ' + e.message + ' ' + e.stack);
    }
}

//function displayForm_DisplayArBasedOnWorkflowStatus(budgetRequestId, action, participantId) {
//    //displayAlertDialog('in the method displayForm_DisplayArBasedOnWorkflowStatus()');
//    //
//    // The filename is the guid, the bwBudgetRequestId.
//    //
//    // The only action is 'Resubmit'. It is kind of like a forced override.
//    //
//    //var appweburl = 'http://localhost';
//    //var appweburl2 = 'http://localhost';

//    //var strUrl = window.location.href;
//    //var part1 = strUrl.split('http://')[1];
//    //var part2 = part1.split('/')[0];
//    //// detect if localhost. If it is, that means we're in dev.
//    //if (part2.split(':')[0] == 'localhost') {
//    //    appweburl = 'http://localhost';
//    //    appweburl2 = 'http://localhost:2181';
//    //} else {
//    //    appweburl = 'http://' + part2;
//    //    appweburl2 = 'http://' + part2;
//    //}

//    var test = appweburl;
//    var test2 = appweburl2;


//    var filename = budgetRequestId;
//    var operationUri = webserviceurl + "/bwbudgetrequests/" + filename;
//    try {
//        $.ajax({
//            url: operationUri,
//            method: "GET",
//            headers: {
//                "Accept": "application/json; odata=verbose"
//            },
//            success: function (data) {
//                //var isSupplementalRequest = data[0].IsSupplementalRequest; 
//                //var relatedBudgetRequestId = data[0].RelatedBudgetRequestId; 

//                //if (data.d.results[1].length > 0) {
//                //    displayAlertDialog('This BR has supplementals!!!');
//                //}


//                // We need to get the following from the returned BwBudgetRequest data element.
//                var userId = participantId; //9; //_spPageContextInfo.userId;

//                var functionalAreaId = data.d.results[0][0].FunctionalAreaId; //1;
//                var pmAccountId = data.d.results[0][0].ManagerId; //9;
//                var arStatus = data.d.results[0][0].ARStatus; //'Submitted';
//                var workflowStatus = data.d.results[0][0].BudgetWorkflowStatus; //'Assign Budget';
//                var xml = data.d.results[0][0].bwDocumentXml
//                bwApprovalLevelWorkflowToken = data.d.results[0][0].bwApprovalLevelWorkflowToken; // global declared in my.js

//                var isSupplementalRequest = data.d.results[0][0].IsSupplementalRequest;
//                if (isSupplementalRequest == 'true') isSupplementalRequest = true;

//                //var pmUserId = data.d.results[0][0].ManagerId;

//                var file = "";
//                var status = "";

//                if (action == 'Resubmit') {
//                    var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
//                    try {
//                        if (xml == 'undefined') xmlUndefined = true;
//                    } catch (e) {
//                    // no action necessary.
//                    }
//                    if ((xml == null) || xmlUndefined) {
//                        displayAlertDialog('Error loading the file.');
//                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus().Resubmit', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
//                        redirectForm();
//                    } else {
//                        //$.ajax({
//                        //    url: webserviceurl + "/_api/web/lists/getbytitle('BudgetRequests')/items",
//                        //    method: "GET",
//                        //    headers: { "Accept": "application/json; odata=verbose" },
//                        //    success: function (data) {
//                                status = "";
//                                var xslFile = "";
//                                xslFile = "/" + viewsFolderName + "/ResubmitEditForm.xsl";
//                                file = appweburl2 + xslFile;
//                                status = 'Enter the necessary details then click the "Submit the AR" button.';
//                                var xsl = null;
//                                try //Internet Explorer
//                                {
//                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                    xsl.async = false;
//                                    xsl.load(file);
//                                }
//                                catch (e) {
//                                    try //Firefox, Mozilla, Opera, etc.
//                                    {
//                                        xsl = document.implementation.createDocument("", "", null);
//                                        xsl.async = false;
//                                        xsl.load(file);
//                                    }
//                                    catch (e) {
//                                        try //Google Chrome
//                                        {
//                                            var xmlhttp = new window.XMLHttpRequest();
//                                            xmlhttp.open("GET", file, false);
//                                            xmlhttp.send(null);
//                                            xsl = xmlhttp.responseXML.documentElement;
//                                        }
//                                        catch (e) {
//                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Resubmit: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                            redirectForm();
//                                        }
//                                    }
//                                }
//                                var s = TransformToHtmlText(xml, xsl);
//                                $('#myxml').append(s);

//                                populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                //$.getScript(scriptbase + "sp.workflowservices.js",
//                                //function () {
//                                //    initializePeoplePicker('peoplePicker'); // todd put this back at some point
//                                    //populateYear();
//                                    //populateCategories();
//                                    //decodeUriInAllFields();
//                                    //formatRequestedCapital();
//                                    //formatRequestedExpense();
//                                    ////formatBudgetAmount(); 
//                                    //formatCurrency2('my:Budget_Amount2');
//                                    //formatCurrency2('my:ExpenseEquipmentAndParts');
//                                    //formatCurrency2('my:CostOfEquipmentAndParts');
//                                    //formatCurrency2('my:ExpenseInternalLabor');
//                                    //formatCurrency2('my:CostOfInternalLabor');
//                                    //formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                    //formatCurrency2('my:CostOfOutsideServices');
//                                    //formatCurrency2('my:OtherExpense');
//                                    //formatCurrency2('my:OtherCapital');
//                                    //formatCurrency2('my:SalesTax');
//                                    //// Get rid of the empty elements in the <ol> tag.
//                                    //clearEmptyListItems();
//                                    ////populateAttachments2(true);
//                                    ////populateArAttachments2(true);
//                                    //document.getElementById('strProjectTitle').focus();
//                                //});
//                        //    },
//                        //    error: function (data, errorCode, errorMessage) {
//                        //        displayAlertDialog('Error accessing the budget requests.');
//                        //        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus().Resubmit', 'Error accessing the budget requests: ' + errorCode + ', ' + errorMessage);
//                        //        redirectForm();
//                        //    }
//                        //});
//                    }
//                } else if (arStatus == 'Active') {
//                    var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
//                    try {
//                        if (xml == 'undefined') xmlUndefined = true;
//                    } catch (e) {
//                    // no action necessary.
//                    }
//                    if ((xml == null) || xmlUndefined) {
//                        displayAlertDialog('Error loading the file.');
//                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
//                        redirectForm();
//                    } else {

//                        //// Todd: Check if the user has been assigned this task. This will determine if we display the EditForm or the DispForm.
//                        //$.ajax({
//                        //    url: appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                        //    method: "GET",
//                        //    headers: { "Accept": "application/json; odata=verbose" },
//                        //    success: function (data) {
//                        //for (var i = 0; i < data.d.results.length; i++) {
//                        //    if (functionalAreaId == data.d.results[i].Id) {
//                        //        var userId = _spPageContextInfo.userId;
//                        //        var isApprover = false; // Check if the user is an approver.
//                        //        // multiple user check. removing for this version
//                        //        //var assignBudgetUsers = data.d.results[0].Approver1Id.results;
//                        //        //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                        //        //    var assignBudgetUserId = assignBudgetUsers[u]; //data.d.results[0].Approver1Id.results[u];
//                        //        //    if (assignBudgetUserId == userId) isApprover = true;
//                        //        //}
//                        //        var assignBudgetUserId = data.d.results[0].Approver1Id;
//                        //        if (assignBudgetUserId == userId) isApprover = true;
//                        //    }
//                        //}
//                        //var status = "";
//                        //if (isApprover) {
//                        //    file = appweburl + "/Pages/Views/AssignBudgetEditForm.xsl";
//                        //    status = 'Enter the "Budget Amount", and click the "Save and Approve" button.';
//                        //} else {
//                        file = appweburl2 + "/" + viewsFolderName + "/IssuePODispForm.xsl";
//                        status = 'A Purchase Order number has been issued for this AR.';
//                        //}

//                        var xsl = null;
//                        try //Internet Explorer
//                        {
//                            xsl = new ActiveXObject("Microsoft.XMLDOM");
//                            xsl.async = false;
//                            xsl.load(file);
//                        }
//                    catch (e) {
//                            try //Firefox, Mozilla, Opera, etc.
//                            {
//                                xsl = document.implementation.createDocument("", "", null);
//                                xsl.async = false;
//                                xsl.load(file);
//                            }
//                        catch (e) {
//                                try //Google Chrome
//                                {
//                                    var xmlhttp = new window.XMLHttpRequest();
//                                    xmlhttp.open("GET", file, false);
//                                    xmlhttp.send(null);
//                                    xsl = xmlhttp.responseXML.documentElement;
//                                }
//                            catch (e) {
//                                    displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'A Purchase Order number has been issued for this AR: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                    redirectForm();
//                                }
//                            }
//                        }
//                        //xmlDoc = xml;
//                        var s = TransformToHtmlText(xml, xsl);
//                        $('#myxml').append(s);



//                        var isSupplementalRequest = false;
//                        if (data.d.results[0][0].IsSupplementalRequest == 'true') isSupplementalRequest = true;



//                        var brTitle = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;

//                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');

//                        if (isSupplementalRequest == true) {
//                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Supplemental Request: ' + filename.replace('.xml', '');
//                            // ALSO SET THE TITLE
//                            $('#divWelcomeMasterDivTitle').text('Supplemental Request: ' + filename.replace('.xml', ''));

//                            displayRootBudgetRequestOnSupplementalForm();


//                        } else {
//                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                            // ALSO SET THE TITLE

//                            //displayAlertDialog('SET THE TITLE1');

//                            $('#divWelcomeMasterDivTitle').text('Authorization Request: ' + filename.replace('.xml', ''));


//                            // Check if supplementals are enabled.
//                            if (supplementalsEnabled == true) {
//                                var html = '';
//                                html += '<input onclick="cmdCreateSupplementalAr(\'' + budgetRequestId + '\', \'' + functionalAreaId + '\', \'' + pmAccountId + '\', \'' + brTitle + '\');" type="button" name="SupplementalAr" id="btnSupplementalAr" value="Create a Supplemental Request" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 230px; cursor:pointer;"/>';
//                                document.getElementById('spanCreateSupplementalRequestButtonPlaceholder').innerHTML = html;
//                            }



//                            // Check if closeouts are enabled.
//                            if (closeoutsEnabled == true) {
//                                html = '<input onclick="displayForm_DisplayCloseOut(\'' + budgetRequestId + '\');" type="button" name="Closeout" id="btnCloseout" value="View Closeout" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 130px; cursor:pointer;"/>';
//                                document.getElementById('spanViewCloseoutButtonPlaceholder').innerHTML = html;
//                            }

//                            //spanViewCloseoutButtonPlaceholder
//                        }




//                        displaySupplementalsOnBudgetRequestForm(data);

//                        //// Display Supplementals list!
//                        //if (data.d.results[1].length > 0) {
//                        //    //displayAlertDialog('This BR has supplementals2!!!');
//                        //    var html = '';
//                        //    html += '<table style="width:100%;">';
//                        //    for (var z = 0; z < data.d.results[1].length; z++) {
//                        //        if (z == 0) {
//                        //            html += ' <tr>';
//                        //            html += '    <td>';
//                        //            html += '      There are ' + data.d.results[1].length + ' supplemental request(s):<br />';
//                        //            html += '    </td>';
//                        //            html += '    <td style="width:5%;white-space:nowrap;">';
//                        //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                        //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                        //            html += '    </td>';
//                        //            html += '  </tr>';
//                        //        } else {
//                        //            html += ' <tr>';
//                        //            html += '    <td>';
//                        //            html += '    </td>';
//                        //            html += '    <td style="width:5%;white-space:nowrap;">';
//                        //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                        //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                        //            html += '    </td>';
//                        //            html += '  </tr>';
//                        //        }
//                        //    }
//                        //    html += '</table>';
//                        //    document.getElementById('spanRelatedRequestsList').innerHTML = html;
//                        //}


//                        // Format the form.
//                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                        decodeUriInAllFields();
//                        formatRequestedExpense();
//                        formatRequestedCapital();
//                        //formatBudgetAmount2();
//                        formatCurrency2('my:Budget_Amount2');

//                        formatCurrency2('my:ExpenseEquipmentAndParts');
//                        formatCurrency2('my:CostOfEquipmentAndParts');
//                        formatCurrency2('my:ExpenseInternalLabor');
//                        formatCurrency2('my:CostOfInternalLabor');
//                        formatCurrency2('my:ExpenseCostOfOutsideServices');
//                        formatCurrency2('my:CostOfOutsideServices');
//                        formatCurrency2('my:OtherExpense');
//                        formatCurrency2('my:OtherCapital');
//                        formatCurrency2('my:SalesTax');

//                        recalculateCosts();

//                        populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
//                        //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                        //populateAttachments2(false);
//                        //populateArAttachments2(false);
//                    }
//                } else if (arStatus == 'Approved') {
//                    var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
//                    try {
//                        if (xml == 'undefined') xmlUndefined = true;
//                    } catch (e) {
//                    // no action necessary.
//                    }
//                    if ((xml == null) || xmlUndefined) {
//                        displayAlertDialog('Error loading the file.');
//                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
//                        redirectForm();
//                    } else {
//                        switch (workflowStatus) {
//                            case 'Procurement: Issue PO#':


//                                var data = {
//                                    bwWorkflowAppId: workflowAppId
//                                };
//                                $.ajax({
//                                    url: webserviceurl + "/bwdepartments",
//                                    type: "DELETE",
//                                    contentType: 'application/json',
//                                    data: JSON.stringify(data),
//                                    success: function (data) {
//                                        //displayAlertDialog(JSON.stringify(data));
//                                        //if (data.length > 0) {
//                                        //    for (var i = 0; i < data.length; i++) {
//                                        //        if (data[i].bwDepartmentTitle == 'Procurement') {
//                                        //            $('#txtBwDepartmentUserName').val(data[i].bwDepartmentUserName);
//                                        //            $('#txtBwDepartmentUserId').val(data[i].bwDepartmentUserId);
//                                                    // Create the button.



//                                //$.ajax({
//                                //    url: webserviceurl + "/_api/web/lists/getbytitle('Departments')/items",
//                                //    method: "GET",
//                                //    headers: { "Accept": "application/json; odata=verbose" },
//                                        //    success: function (data) {
//                                        var procurementUserId;
//                                        for (var i = 0; i < data.length; i++) {
//                                            if ("Procurement" == data[i].bwDepartmentTitle) {
//                                                var isApprover = false; // Check if the user is an approver.
//                                                procurementUserId = data[i].bwDepartmentUserId;
//                                                if (procurementUserId == userId) isApprover = true;
//                                            }
//                                        }
//                                        var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + procurementUserId;
//                                        $.ajax({
//                                            url: operationUri, //appweburl + "/_api/web/GetUserById(" + assignBudgetUserId + ")",
//                                            method: "GET",
//                                            headers: { "Accept": "application/json; odata=verbose" },
//                                            success: function (data) {


//                                        //$.ajax({
//                                        //    url: webserviceurl + "/_api/web/GetUserById(" + procurementUserId + ")",
//                                        //    method: "GET",
//                                        //    headers: { "Accept": "application/json; odata=verbose" },
//                                        //    success: function (data) {
//                                                status = "";
//                                                var xslFile = "";
//                                                if (isApprover) {
//                                                    xslFile = "/" + viewsFolderName + "/IssuePOEditForm.xsl";
//                                                    file = appweburl2 + xslFile;
//                                                    status = 'Enter the Purchase Order Number then click the "Assign PO#" button.';
//                                                } else {
//                                                    xslFile = "/" + viewsFolderName + "/IssuePODispForm.xsl";
//                                                    file = appweburl2 + xslFile;
//                                                    status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to issue the PO#.';
//                                                }

//                                                var xsl = null;
//                                                try //Internet Explorer
//                                                {
//                                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Firefox, Mozilla, Opera, etc.
//                                                    {
//                                                        xsl = document.implementation.createDocument("", "", null);
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Google Chrome
//                                                        {
//                                                            var xmlhttp = new window.XMLHttpRequest();
//                                                            xmlhttp.open("GET", file, false);
//                                                            xmlhttp.send(null);
//                                                            xsl = xmlhttp.responseXML.documentElement;
//                                                        }
//                                                    catch (e) {
//                                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Procurement: Issue PO#: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                            redirectForm();
//                                                        }
//                                                    }
//                                                }
//                                                //xmlDoc = xml;
//                                                var s = TransformToHtmlText(xml, xsl);
//                                                $('#myxml').append(s);
//                                                // Format the form.
//                                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                decodeUriInAllFields();
//                                                formatRequestedExpense();
//                                                formatRequestedCapital();
//                                                //formatBudgetAmount();
//                                                formatCurrency2('my:Budget_Amount2');
//                                                formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                formatCurrency2('my:CostOfEquipmentAndParts');
//                                                formatCurrency2('my:ExpenseInternalLabor');
//                                                formatCurrency2('my:CostOfInternalLabor');
//                                                formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                formatCurrency2('my:CostOfOutsideServices');
//                                                formatCurrency2('my:OtherExpense');
//                                                formatCurrency2('my:OtherCapital');
//                                                formatCurrency2('my:SalesTax');
//                                                if (xslFile === "/" + viewsFolderName + "/IssuePOEditForm.xsl") {
//                                                    // Get rid of the empty elements in the <ol> tag.
//                                                    clearEmptyListItems();
//                                                }
//                                                if (isApprover) $('span[xd\\:binding = "my:coSAPInternalOrderNumber"]')[0].focus();

//                                                if (xslFile == "/" + viewsFolderName + "/IssuePOEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
//                                                //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                //populateAttachments2(false);
//                                                //populateArAttachments2(false);
//                                            },
//                                            error: function (data, errorCode, errorMessage) {
//                                                //window.waitDialog.close();
//                                                displayAlertDialog('Error retrieving procurement user display name.');
//                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving procurement user display name: ' + errorCode + ', ' + errorMessage);
//                                            }
//                                        });
//                                    },
//                                    error: function (data, errorCode, errorMessage) {
//                                        displayAlertDialog('Error accessing Departments.');
//                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                        redirectForm();
//                                    }
//                                });
//                                break;
//                            case 'PO# Issued':
//                                file = appweburl2 + "/" + viewsFolderName + "/IssuePODispForm.xsl";
//                                status = 'The PO# has been assigned for this AR.';
//                                var xsl = null;
//                                try //Internet Explorer
//                                {
//                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                    xsl.async = false;
//                                    xsl.load(file);
//                                }
//                            catch (e) {
//                                    try //Firefox, Mozilla, Opera, etc.
//                                    {
//                                        xsl = document.implementation.createDocument("", "", null);
//                                        xsl.async = false;
//                                        xsl.load(file);
//                                    }
//                                catch (e) {
//                                        try //Google Chrome
//                                        {
//                                            var xmlhttp = new window.XMLHttpRequest();
//                                            xmlhttp.open("GET", file, false);
//                                            xmlhttp.send(null);
//                                            xsl = xmlhttp.responseXML.documentElement;
//                                        }
//                                    catch (e) {
//                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The PO# has been issued for this AR: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                            redirectForm();
//                                        }
//                                    }
//                                }
//                                //xmlDoc = xml;
//                                var s = TransformToHtmlText(xml, xsl);
//                                $('#myxml').append(s);
//                                // Format the form.
//                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                decodeUriInAllFields();
//                                formatRequestedExpense();
//                                formatRequestedCapital();
//                                formatBudgetAmount();
//                                formatCurrency2('my:ExpenseEquipmentAndParts');
//                                formatCurrency2('my:CostOfEquipmentAndParts');
//                                formatCurrency2('my:ExpenseInternalLabor');
//                                formatCurrency2('my:CostOfInternalLabor');
//                                formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                formatCurrency2('my:CostOfOutsideServices');
//                                formatCurrency2('my:OtherExpense');
//                                formatCurrency2('my:OtherCapital');
//                                formatCurrency2('my:SalesTax');
//                                recalculateCosts();

//                                populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
//                                //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                //populateAttachments2(false);
//                                //populateArAttachments2(false);
//                                break;
//                            case 'Issue PO#: Additional Info Needed':
//                                var isApprover = false; // Check if the user is an approver.
//                                $.ajax({
//                                    url: webserviceurl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                    method: "GET",
//                                    headers: { "Accept": "application/json; odata=verbose" },
//                                    success: function (data) {
//                                        //var userId = _spPageContextInfo.userId;
//                                        var pmUserId = data.d.Id;
//                                        if (pmUserId == userId) isApprover = true;
//                                        //var userDisplayName = data.d.Title; // Display Name.
//                                        status = "";
//                                        if (isApprover) {
//                                            file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                            status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                        } else {
//                                            file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                            status = 'Waiting for additional information to be added to the AR by ' + data.d.Title + '.';
//                                        }

//                                        var xsl = null;
//                                        try //Internet Explorer
//                                        {
//                                            xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                            xsl.async = false;
//                                            xsl.load(file);
//                                        }
//                                    catch (e) {
//                                            try //Firefox, Mozilla, Opera, etc.
//                                            {
//                                                xsl = document.implementation.createDocument("", "", null);
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Google Chrome
//                                                {
//                                                    var xmlhttp = new window.XMLHttpRequest();
//                                                    xmlhttp.open("GET", file, false);
//                                                    xmlhttp.send(null);
//                                                    xsl = xmlhttp.responseXML.documentElement;
//                                                }
//                                            catch (e) {
//                                                    displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Issue PO#: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                    redirectForm();
//                                                }
//                                            }
//                                        }
//                                        var s = TransformToHtmlText(xml, xsl);
//                                        $('#myxml').append(s);
//                                        // Format the form.
//                                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                        decodeUriInAllFields();
//                                        formatRequestedExpense();
//                                        formatRequestedCapital();
//                                        formatBudgetAmount();
//                                        formatCurrency2('my:ExpenseEquipmentAndParts');
//                                        formatCurrency2('my:CostOfEquipmentAndParts');
//                                        formatCurrency2('my:ExpenseInternalLabor');
//                                        formatCurrency2('my:CostOfInternalLabor');
//                                        formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                        formatCurrency2('my:CostOfOutsideServices');
//                                        formatCurrency2('my:OtherExpense');
//                                        formatCurrency2('my:OtherCapital');
//                                        formatCurrency2('my:SalesTax');
//                                        recalculateCosts();
//                                        if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                        if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                        else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
//                                        //populateAttachments2(false);
//                                        //populateArAttachments2(true); // we want to display the remove button!!
//                                    },
//                                    error: function (data, errorCode, errorMessage) {
//                                        displayAlertDialog('Error looking up PM User Id.');
//                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                        redirectForm();
//                                    }
//                                });
//                                break;
//                            default:
//                                file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                status = 'This AR has been approved.';
//                                var xsl = null;
//                                try //Internet Explorer
//                                {
//                                    xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                    xsl.async = false;
//                                    xsl.load(file);
//                                }
//                            catch (e) {
//                                    try //Firefox, Mozilla, Opera, etc.
//                                    {
//                                        xsl = document.implementation.createDocument("", "", null);
//                                        xsl.async = false;
//                                        xsl.load(file);
//                                    }
//                                catch (e) {
//                                        try //Google Chrome
//                                        {
//                                            var xmlhttp = new window.XMLHttpRequest();
//                                            xmlhttp.open("GET", file, false);
//                                            xmlhttp.send(null);
//                                            xsl = xmlhttp.responseXML.documentElement;
//                                        }
//                                    catch (e) {
//                                            displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The AR has been approved: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                            redirectForm();
//                                        }
//                                    }
//                                }
//                                //xmlDoc = xml;
//                                var s = TransformToHtmlText(xml, xsl);
//                                $('#myxml').append(s);
//                                // Format the form.

//                                var isSupplementalRequest = false;
//                                if (data.d.results[0][0].IsSupplementalRequest == 'true') isSupplementalRequest = true;


//                                var brTitle = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;


//                                //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');

//                                if (isSupplementalRequest == true) {
//                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Supplemental Request: ' + filename.replace('.xml', '');
//                                    // ALSO SET THE TITLE
//                                    $('#divWelcomeMasterDivTitle').text('Supplemental Request: ' + filename.replace('.xml', ''));

//                                    displayRootBudgetRequestOnSupplementalForm();
//                                } else {
//                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                    // ALSO SET THE TITLE

//                                    //displayAlertDialog('SET THE TITLE2');

//                                    $('#divWelcomeMasterDivTitle').text('Authorization Request: ' + brTitle); //filename.replace('.xml', ''));

//                                    // Check if supplementals are enabled.
//                                    if (supplementalsEnabled == true) {
//                                        var html = '';
//                                        html += '<input onclick="cmdCreateSupplementalAr(\'' + budgetRequestId + '\', \'' + functionalAreaId + '\', \'' + pmAccountId + '\', \'' + brTitle + '\');" type="button" name="SupplementalAr" id="btnSupplementalAr" value="Create a Supplemental Request" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 230px; cursor:pointer;"/>';
//                                        document.getElementById('spanCreateSupplementalRequestButtonPlaceholder').innerHTML = html;
//                                    }


//                                    // Check if closeouts are enabled.
//                                    if (closeoutsEnabled == true) {
//                                        html = '<input onclick="displayForm_DisplayCloseOut(\'' + budgetRequestId + '\');" type="button" name="Closeout" id="btnCloseout" value="View Closeout" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 130px; cursor:pointer;"/>';
//                                        document.getElementById('spanViewCloseoutButtonPlaceholder').innerHTML = html;
//                                    }

//                                    //spanViewCloseoutButtonPlaceholder
//                                }



//                                $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                decodeUriInAllFields();
//                                formatRequestedExpense();
//                                formatRequestedCapital();
//                                //formatBudgetAmount();

//                                //displayAlertDialog('DO WE NEED TO ADD THE ONCLICK TO THE DETAILS BUTTON HERE1');
//                                $('#btnDetails').click(function (error) {
//                                    var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;
//                                    var projectTitle = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML;
//                                    displayArInDialog(appweburl, budgetRequestId, budgetRequestId, projectTitle, title);
//                                });

//                                // WE NEED TO ADD THE "Create Supplemental Request" button here.

//                                // <input onclick="cmdCreateSupplementalAr();" type="button" name="SupplementalAr" id="btnSupplementalAr" value="Create a Supplemental Request" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 230px; cursor:pointer;"/>


//                                //var html = '';
//                                //html += '<input onclick="cmdCreateSupplementalAr(\'' + budgetRequestId + '\', \'' + functionalAreaId + '\', \'' + pmAccountId + '\');" type="button" name="SupplementalAr" id="btnSupplementalAr" value="Create a Supplemental Request" class="langFont" style="white-space:nowrap;MARGIN: 1px; WIDTH: 230px; cursor:pointer;"/>';
//                                //document.getElementById('spanCreateSupplementalRequestButtonPlaceholder').innerHTML = html;

//                                displaySupplementalsOnBudgetRequestForm(data);

//                                //// Display Supplementals list!
//                                //if (data.d.results[1].length > 0) {
//                                //    //displayAlertDialog('This BR has supplementals2!!!');
//                                //    var html = '';
//                                //    html += '<table style="width:100%;">';
//                                //    for (var z = 0; z < data.d.results[1].length; z++) {
//                                //        if (z == 0) {
//                                //            html += ' <tr>';
//                                //            html += '    <td>';
//                                //            html += '      There are ' + data.d.results[1].length + ' supplemental request(s):<br />';
//                                //            html += '    </td>';
//                                //            html += '    <td style="width:5%;white-space:nowrap;">';
//                                //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                                //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                                //            html += '    </td>';
//                                //            html += '  </tr>';
//                                //        } else {
//                                //            html += ' <tr>';
//                                //            html += '    <td>';
//                                //            html += '    </td>';
//                                //            html += '    <td style="width:5%;white-space:nowrap;">';
//                                //            //html += '<a href="javascript:displayAlertDialog(\'This functionality is incomplete. Coming soon!\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                                //            html += '<a href="javascript:displayArOnTheHomePage(\'' + data.d.results[1][z].bwBudgetRequestId + '\', \'' + participantId + '\');">' + data.d.results[1][z].ProjectTitle + '</a><br />';
//                                //            html += '    </td>';
//                                //            html += '  </tr>';
//                                //        }
//                                //    }
//                                //    html += '</table>';
//                                //    document.getElementById('spanRelatedRequestsList').innerHTML = html;
//                                //}
//                                formatCurrency2('my:Budget_Amount2');
//                                formatCurrency2('my:ExpenseEquipmentAndParts');
//                                formatCurrency2('my:CostOfEquipmentAndParts');
//                                formatCurrency2('my:ExpenseInternalLabor');
//                                formatCurrency2('my:CostOfInternalLabor');
//                                formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                formatCurrency2('my:CostOfOutsideServices');
//                                formatCurrency2('my:OtherExpense');
//                                formatCurrency2('my:OtherCapital');
//                                formatCurrency2('my:SalesTax');

//                                recalculateCosts();

//                                populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                //populateAttachments2(false);

//                                //populateArAttachments2(false);
//                                break;
//                        }
//                    }
//                } else if (arStatus == 'Quote Approved') {
//                    var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
//                    try {
//                        if (xml == 'undefined') xmlUndefined = true;
//                    } catch (e) {
//                    // no action necessary.
//                    }
//                    if ((xml == null) || xmlUndefined) {
//                        displayAlertDialog('Error loading the file.');
//                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
//                        redirectForm();
//                    } else {
//                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                        status = 'This AR has been approved.';
//                        var xsl = null;
//                        try //Internet Explorer
//                        {
//                            xsl = new ActiveXObject("Microsoft.XMLDOM");
//                            xsl.async = false;
//                            xsl.load(file);
//                        }
//                    catch (e) {
//                            try //Firefox, Mozilla, Opera, etc.
//                            {
//                                xsl = document.implementation.createDocument("", "", null);
//                                xsl.async = false;
//                                xsl.load(file);
//                            }
//                        catch (e) {
//                                try //Google Chrome
//                                {
//                                    var xmlhttp = new window.XMLHttpRequest();
//                                    xmlhttp.open("GET", file, false);
//                                    xmlhttp.send(null);
//                                    xsl = xmlhttp.responseXML.documentElement;
//                                }
//                            catch (e) {
//                                    displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The AR has been approved: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                    redirectForm();
//                                }
//                            }
//                        }
//                        //xmlDoc = xml;
//                        var s = TransformToHtmlText(xml, xsl);
//                        $('#myxml').append(s);
//                        // Format the form.
//                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                        decodeUriInAllFields();
//                        formatRequestedExpense();
//                        formatRequestedCapital();
//                        formatBudgetAmount();

//                        //displayAlertDialog('DO WE NEED TO ADD THE ONCLICK TO THE DETAILS BUTTON HERE2');
//                        $('#btnDetails').click(function (error) {
//                            var title = $('span[xd\\:binding = "my:Title"]')[0].innerHTML;
//                            var projectTitle = $('span[xd\\:binding = "my:Project_Name"]')[0].innerHTML;
//                            displayArInDialog(appweburl, budgetRequestId, budgetRequestId, projectTitle, title);
//                        });

//                        formatCurrency2('my:ExpenseEquipmentAndParts');
//                        formatCurrency2('my:CostOfEquipmentAndParts');
//                        formatCurrency2('my:ExpenseInternalLabor');
//                        formatCurrency2('my:CostOfInternalLabor');
//                        formatCurrency2('my:ExpenseCostOfOutsideServices');
//                        formatCurrency2('my:CostOfOutsideServices');
//                        formatCurrency2('my:OtherExpense');
//                        formatCurrency2('my:OtherCapital');
//                        formatCurrency2('my:SalesTax');

//                        recalculateCosts();

//                        populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
//                        //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                        //populateAttachments2(false);

//                        //populateArAttachments2(false);
//                    }
//                } else if (arStatus == 'Rejected') {
//                    var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
//                    try {
//                        if (xml == 'undefined') xmlUndefined = true;
//                    } catch (e) {
//                    // no action necessary.
//                    }
//                    if ((xml == null) || xmlUndefined) {
//                        displayAlertDialog('Error loading the file.');
//                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
//                        redirectForm();
//                    } else {
//                        //file = appweburl + "/Pages/Views/BudgetApprovalDispForm.xsl";
//                        file = appweburl2 + "/" + viewsFolderName + "/ResubmitDispForm.xsl";
//                        status = 'This AR has been rejected.';
//                        var xsl = null;
//                        try //Internet Explorer
//                        {
//                            xsl = new ActiveXObject("Microsoft.XMLDOM");
//                            xsl.async = false;
//                            xsl.load(file);
//                        }
//                    catch (e) {
//                            try //Firefox, Mozilla, Opera, etc.
//                            {
//                                xsl = document.implementation.createDocument("", "", null);
//                                xsl.async = false;
//                                xsl.load(file);
//                            }
//                        catch (e) {
//                                try //Google Chrome
//                                {
//                                    var xmlhttp = new window.XMLHttpRequest();
//                                    xmlhttp.open("GET", file, false);
//                                    xmlhttp.send(null);
//                                    xsl = xmlhttp.responseXML.documentElement;
//                                }
//                            catch (e) {
//                                    displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The AR has been rejected: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                    redirectForm();
//                                }
//                            }
//                        }
//                        //xmlDoc = xml;
//                        var s = TransformToHtmlText(xml, xsl);
//                        $('#myxml').append(s);
//                        // Format the form.
//                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                        //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                        $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                        decodeUriInAllFields();
//                        formatRequestedExpense();
//                        formatRequestedCapital();
//                        formatBudgetAmount();
//                        formatCurrency2('my:ExpenseEquipmentAndParts');
//                        formatCurrency2('my:CostOfEquipmentAndParts');
//                        formatCurrency2('my:ExpenseInternalLabor');
//                        formatCurrency2('my:CostOfInternalLabor');
//                        formatCurrency2('my:ExpenseCostOfOutsideServices');
//                        formatCurrency2('my:CostOfOutsideServices');
//                        formatCurrency2('my:OtherExpense');
//                        formatCurrency2('my:OtherCapital');
//                        formatCurrency2('my:SalesTax');

//                        populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);
//                        //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                        //populateAttachments2(false);

//                        //populateArAttachments2(false);
//                    }
//                } else if (arStatus == 'Submitted') {
//                    if (workflowStatus != null) {
//                        //loadXML(appweburl + '/Lists/BudgetRequests/' + filename, function (xml) { // THIS IS OLD
//                        //loadXML(appweburl + "/_api/web/lists/getbytitle('BudgetRequests')/GetItems/" + filename, function (xml) { // THIS WORKS WITH A STATIC FILE
//                        //loadXML(appweburl + "/bwbudgetrequests/" + filename, function (xml) { // filename is the guid of the BR
//                        var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
//                        try {
//                            if (xml == 'undefined') xmlUndefined = true;
//                        } catch (e) {
//                        // no action necessary.
//                        }
//                        if ((xml == null) || xmlUndefined) {
//                            displayAlertDialog('Error loading the file.');
//                            //WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + filename);
//                            //redirectForm();
//                        } else {
//                            switch (workflowStatus) {
//                                case 'Assign Budget':
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var assignBudgetUserId = null;
//                                            //displayAlertDialog(JSON.stringify(data));
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver1Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; //data.d.results[0].Approver1Id.results[u];
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    assignBudgetUserId = data.d.results[i].Approver1Id;
//                                                    if (assignBudgetUserId == userId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + assignBudgetUserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + assignBudgetUserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    var file;
//                                                    status = "";
//                                                    if (isApprover) {
//                                                        //file = appweburl + "/Pages/Views/AssignBudgetEditForm.xsl";
//                                                        //displayAlertDialog('editform');
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AssignBudgetEditForm.xsl";
//                                                        status = 'Enter the "Budget Amount" then click the "Save and Approve" button.';
//                                                    } else {
//                                                        //file = appweburl + "/Pages/Views/AssignBudgetDispForm.xsl";
//                                                        //displayAlertDialog('dispform');
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AssignBudgetDispForm.xsl";
//                                                        status = 'Waiting for the Budget Amount to be assigned by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Assign Budget: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }

//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);

//                                                    if (supplementalsEnabled == true) {
//                                                        if (isSupplementalRequest == true) {
//                                                            displayRootBudgetRequestOnSupplementalForm();
//                                                        }
//                                                    }

//                                                    //displayAlertDialog('s:' + s);
//                                                    //$.getScript(scriptbase + "sp.workflowservices.js",
//                                                    //    function () {
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();

//                                                    // This has a drop down because the person assigning the budget may want to change the financial area.
//                                                    if (file.indexOf('AssignBudgetEditForm.xsl') > -1) {
//                                                        // We are still calling it a Budget Request at this stage (before it is created as an AR).
//                                                        var titleBarText = $('#divWelcomeMasterDivTitle').text();
//                                                        titleBarText = titleBarText.replace('Authorization Request:', 'Budget Request:');
//                                                        $('#divWelcomeMasterDivTitle').text(titleBarText);
//                                                        //
//                                                        populateFunctionalAreasForAssignBudgetEditForm(); 
//                                                    }

//                                                    $('#dtEstimatedStartDatex').datepicker();
//                                                    $('#dtEstimatedEndDatex').datepicker();

//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    formatBudgetAmount();
//                                                    //displayAlertDialog(tenantId + '  ' + workflowAppId + '  ' + budgetRequestId);
//                                                    //populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/AssignBudgetEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    cmdExpandComments();
//                                                    //$('span[xd\\:binding = "my:Budget_Amount2"]')[0].focus();




//                                                // Todd re-enable this!!!! 1-9-16: populateAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #1 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_AssignBudget()', 'Error retrieving Approver #1 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Creating the AR':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    //var operationUri = appweburl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
//                                    //$.ajax({
//                                    //    url: operationUri,
//                                    //    method: "GET",
//                                    //    headers: { "Accept": "application/json; odata=verbose" },
//                                    //    success: function (brData) {
//                                            //var userId = participantId;
//                                            //var pmUserId = brData[0].ManagerId;
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var xslFile = "";
//                                            var file;
//                                            if (isApprover) {
//                                                xslFile = "/" + viewsFolderName + "/CreateArEditForm.xsl";
//                                                file = appweburl2 + xslFile;
//                                                status = 'Enter the necessary details then click the "Submit the AR" button.';
//                                            } else {
//                                                xslFile = "/" + viewsFolderName + "/CreateArDispForm.xsl";
//                                                file = appweburl2 + xslFile;
//                                                status = 'Waiting for ' + participantFriendlyName + ' to create the AR.';
//                                            }
//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                            catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                                catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                    catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Creating the AR: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;


//                                    // Hook up the date pickers!!!
//                                            //displayAlertDialog('init datepicker');
//                                            $('#dtEstimatedStartDatex').datepicker();
//                                            $('#dtEstimatedEndDatex').datepicker();
//                                            //$('span[xd\\:binding = "my:Estimated_Start_Date"]')[0].datepicker();
//                                            //$('span[xd\\:binding = "my:Estimated_End_Date"]')[0].datepicker();

//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            //formatBudgetAmount();
//                                            formatCurrency2('my:Budget_Amount2');
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');

//                                            if (xslFile == "/" + viewsFolderName + "/CreateArEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            cmdExpandComments();

//                                            if (xslFile === "/" + viewsFolderName + "/CreateArEditForm.xsl") {
//                                                // Get rid of the empty elements in the <ol> tag.
//                                                clearEmptyListItems();
//                                            }
//                                            //if (isApprover) $('span[xd\\:binding = "my:NecessityOfProposedExpenditure"]')[0].focus();
//                                    //    },
//                                    //    error: function (data, errorCode, errorMessage) {
//                                    //        displayAlertDialog('Error accessing the budget request.');
//                                    //        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing the budget request.: ' + errorCode + ', ' + errorMessage);
//                                    //        redirectForm();
//                                    //    }
//                                    //});
//                                    break;
//                                case 'Approval 1: Review AR':
//                                    //var operationUri = appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items";
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri,
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval2UserId;
//                                            //var userId = participantId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; 
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    approval2UserId = data.d.results[i].Approver2Id;
//                                                    if (approval2UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval2UserId;
//                                            $.ajax({
//                                                url: operationUri,
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 2: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    //xmlDoc = xml;
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();

//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #2 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #2 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 2: Review AR':// Finance Manager(s)
//                                    //displayAlertDialog('Approval 3: Review AR');
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval3UserId;
//                                            //displayAlertDialog(JSON.stringify(data));
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    approval3UserId = data.d.results[i].Approver3Id;
//                                                    if (approval3UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            //displayAlertDialog('approval3UserId: ' + approval3UserId);
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval3UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval3UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }
//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    } catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        } catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            } catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 3: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();


//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);
//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #3 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #3 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 3: Review AR':
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval4UserId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    approval4UserId = data.d.results[i].Approver4Id;
//                                                    if (approval4UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval4UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval4UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 4: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);
//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #4 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #4 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 4: Review AR':// Finance Director(s)
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval5UserId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; 
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    approval5UserId = data.d.results[i].Approver5Id;
//                                                    if (approval5UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval5UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval5UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 5: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    //xmlDoc = xml;
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #5 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #5 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 5: Review AR':// Corporate Finance Director(s)
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval6UserId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; 
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    approval6UserId = data.d.results[i].Approver6Id;
//                                                    if (approval6UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval6UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval6UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 6: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    //xmlDoc = xml;
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #6 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #6 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 6: Review AR':// Corporate General Manager(s)
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval7UserId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; 
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    approval7UserId = data.d.results[i].Approver7Id;
//                                                    if (approval7UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval7UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval7UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 7: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    //xmlDoc = xml;
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #7 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #7 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 7: Review AR':// CFO
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval8UserId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; 
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    approval8UserId = data.d.results[i].Approver8Id;
//                                                    if (approval8UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval8UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval8UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 8: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    //xmlDoc = xml;
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #8 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #8 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 8: Review AR':// CEO
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval9UserId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; 
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    approval9UserId = data.d.results[i].Approver9Id;
//                                                    if (approval9UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval9UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval9UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 9: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    //xmlDoc = xml;
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #9 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #9 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 9: Review AR'://BOD
//                                    var operationUri = webserviceurl + "/bwfunctionalareas/getbyfunctionalareaid/" + functionalAreaId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/lists/getbytitle('FunctionalAreas')/items",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            var approval10UserId;
//                                            for (var i = 0; i < data.d.results.length; i++) {
//                                                if (functionalAreaId == data.d.results[i].bwFunctionalAreaId) {
//                                                    //var userId = _spPageContextInfo.userId;
//                                                    var isApprover = false; // Check if the user is an approver.
//                                                    // multiple user check. removing for this version
//                                                    //var assignBudgetUsers = data.d.results[0].Approver2Id.results;
//                                                    //for (var u = 0; u < assignBudgetUsers.length; u++) {
//                                                    //    var assignBudgetUserId = assignBudgetUsers[u]; 
//                                                    //    if (assignBudgetUserId == userId) isApprover = true;
//                                                    //}
//                                                    approval10UserId = data.d.results[i].Approver10Id;
//                                                    if (approval10UserId == participantId) isApprover = true;
//                                                }
//                                            }
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + approval10UserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + approval10UserId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl";
//                                                        status = "Approve or Reject this AR by clicking one of the buttons below.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/BudgetApprovalDispForm.xsl";
//                                                        status = 'Waiting for ' + data.d.results[0].bwParticipantFriendlyName + ' to Review the AR.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 10: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message);
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    //xmlDoc = xml;
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    //formatBudgetAmount();
//                                                    formatCurrency2('my:Budget_Amount2');
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    cmdExpandComments();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/BudgetApprovalEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(false);
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving Approver #10 display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving Approver #10 display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing functional areas.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing functional areas: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;

//                                case 'Assign Budget: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
//                                    $.ajax({
//                                        url: operationUri,
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (brData) {
//                                            var initiatorId = brData.d.results[0][0].CreatedById; 
//                                            if (initiatorId == participantId) isApprover = true;
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + initiatorId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + initiatorId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                        status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 1: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    formatBudgetAmount();
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);
//                                                    //populateArAttachments2(true); // we want to display the remove button!!
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving the Initiator display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving the Initiator display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing the budget request.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing the budget request.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Creating the AR: Additional Info Needed': 
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
//                                    $.ajax({
//                                        url: operationUri,
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (brData) {
//                                            var initiatorId = brData.d.results[0][0].CreatedById; 
//                                            if (initiatorId == participantId) isApprover = true;
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + initiatorId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/GetUserById(" + initiatorId + ")",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                        status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Create AR: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    formatBudgetAmount();
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();

//                                                    //var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
//                                                    //populateAttachments2(false);

//                                                    //populateArAttachments2(true); // we want to display the remove button!!
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    //window.waitDialog.close();
//                                                    displayAlertDialog('Error retrieving the Initiator display name.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error retrieving the Initiator display name: ' + errorCode + ', ' + errorMessage);
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing the budget request.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing the budget request.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 1: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwbudgetrequests/" + filename; // get the budget request by sending the budget request id.
//                                    $.ajax({
//                                        url: operationUri,
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (brData) {
//                                            var pmUserId = brData.d.results[0][0].ManagerId;
//                                            if (pmUserId == participantId) isApprover = true;
//                                            var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmUserId;
//                                            $.ajax({
//                                                url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                                method: "GET",
//                                                headers: { "Accept": "application/json; odata=verbose" },
//                                                success: function (data) {
//                                                    status = "";
//                                                    var file;
//                                                    if (isApprover) {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                        status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                                    } else {
//                                                        file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                        status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                                    }

//                                                    var xsl = null;
//                                                    try //Internet Explorer
//                                                    {
//                                                        xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                        xsl.async = false;
//                                                        xsl.load(file);
//                                                    }
//                                                catch (e) {
//                                                        try //Firefox, Mozilla, Opera, etc.
//                                                        {
//                                                            xsl = document.implementation.createDocument("", "", null);
//                                                            xsl.async = false;
//                                                            xsl.load(file);
//                                                        }
//                                                    catch (e) {
//                                                            try //Google Chrome
//                                                            {
//                                                                var xmlhttp = new window.XMLHttpRequest();
//                                                                xmlhttp.open("GET", file, false);
//                                                                xmlhttp.send(null);
//                                                                xsl = xmlhttp.responseXML.documentElement;
//                                                            }
//                                                        catch (e) {
//                                                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 2: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                                redirectForm();
//                                                            }
//                                                        }
//                                                    }
//                                                    var s = TransformToHtmlText(xml, xsl);
//                                                    $('#myxml').append(s);
//                                                    // Format the form.
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                                    //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                                    $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                                    decodeUriInAllFields();
//                                                    formatRequestedExpense();
//                                                    formatRequestedCapital();
//                                                    formatBudgetAmount();
//                                                    formatCurrency2('my:ExpenseEquipmentAndParts');
//                                                    formatCurrency2('my:CostOfEquipmentAndParts');
//                                                    formatCurrency2('my:ExpenseInternalLabor');
//                                                    formatCurrency2('my:CostOfInternalLabor');
//                                                    formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                                    formatCurrency2('my:CostOfOutsideServices');
//                                                    formatCurrency2('my:OtherExpense');
//                                                    formatCurrency2('my:OtherCapital');
//                                                    formatCurrency2('my:SalesTax');
//                                                    recalculateCosts();

//                                                    if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                                    else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                                    if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                                    //populateAttachments2(false);
//                                                    //populateArAttachments2(true); // we want to display the remove button!!
//                                                },
//                                                error: function (data, errorCode, errorMessage) {
//                                                    displayAlertDialog('Error looking up PM User Id.');
//                                                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                                    redirectForm();
//                                                }
//                                            });
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error accessing the budget request.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error accessing the budget request.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 2: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            //var userId = _spPageContextInfo.userId;
//                                            //var pmUserId = data.d.Id;
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            //var userDisplayName = data.d.Title; // Display Name.
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 3: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 3: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 4: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 4: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 5: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 5: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 6: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 6: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 7: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 7: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 8: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 8: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 9: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                case 'Approval 9: Additional Info Needed':
//                                    var isApprover = false; // Check if the user is an approver.
//                                    var operationUri = webserviceurl + "/bwparticipants/getuserdetailsbyparticipantid/" + pmAccountId;
//                                    $.ajax({
//                                        url: operationUri, //appweburl + "/_api/web/siteusers(@v)?@v='" + pmAccountId + "'",
//                                        method: "GET",
//                                        headers: { "Accept": "application/json; odata=verbose" },
//                                        success: function (data) {
//                                            if (pmAccountId == participantId) isApprover = true;
//                                            status = "";
//                                            var file;
//                                            if (isApprover) {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl";
//                                                status = "Additional information has been requested. Modify the details and re-submit the AR for approval.";
//                                            } else {
//                                                file = appweburl2 + "/" + viewsFolderName + "/AdditionalInformationDispForm.xsl";
//                                                status = 'Waiting for additional information to be added to the AR by ' + data.d.results[0].bwParticipantFriendlyName + '.';
//                                            }

//                                            var xsl = null;
//                                            try //Internet Explorer
//                                            {
//                                                xsl = new ActiveXObject("Microsoft.XMLDOM");
//                                                xsl.async = false;
//                                                xsl.load(file);
//                                            }
//                                        catch (e) {
//                                                try //Firefox, Mozilla, Opera, etc.
//                                                {
//                                                    xsl = document.implementation.createDocument("", "", null);
//                                                    xsl.async = false;
//                                                    xsl.load(file);
//                                                }
//                                            catch (e) {
//                                                    try //Google Chrome
//                                                    {
//                                                        var xmlhttp = new window.XMLHttpRequest();
//                                                        xmlhttp.open("GET", file, false);
//                                                        xmlhttp.send(null);
//                                                        xsl = xmlhttp.responseXML.documentElement;
//                                                    }
//                                                catch (e) {
//                                                        displayAlertDialog('Failure attempting to parse XSLT in the browser.');
//                                                        WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Approval 10: Additional Info Needed: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message); // todd make sure this matches the case statement text.
//                                                        redirectForm();
//                                                    }
//                                                }
//                                            }
//                                            var s = TransformToHtmlText(xml, xsl);
//                                            $('#myxml').append(s);
//                                            // Format the form.
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = filename.replace('.xml', '');
//                                            //$('span[xd\\:binding = "my:ARTitleAppended"]')[0].innerHTML = 'Authorization Request: ' + filename.replace('.xml', '');
//                                            $('span[xd\\:binding = "my:Status"]')[0].innerHTML = status;
//                                            decodeUriInAllFields();
//                                            formatRequestedExpense();
//                                            formatRequestedCapital();
//                                            formatBudgetAmount();
//                                            formatCurrency2('my:ExpenseEquipmentAndParts');
//                                            formatCurrency2('my:CostOfEquipmentAndParts');
//                                            formatCurrency2('my:ExpenseInternalLabor');
//                                            formatCurrency2('my:CostOfInternalLabor');
//                                            formatCurrency2('my:ExpenseCostOfOutsideServices');
//                                            formatCurrency2('my:CostOfOutsideServices');
//                                            formatCurrency2('my:OtherExpense');
//                                            formatCurrency2('my:OtherCapital');
//                                            formatCurrency2('my:SalesTax');
//                                            recalculateCosts();

//                                            if (file == appweburl2 + "/" + viewsFolderName + "/AdditionalInformationEditForm.xsl") populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', true);
//                                            else populateAttachments(workflowAppId, budgetRequestId, 'attachmentsInXslForm', false);

//                                            if (isApprover) $('span[xd\\:binding = "my:ReviewerComments"]')[0].focus();
//                                            //populateAttachments2(false);
//                                            //populateArAttachments2(true); // we want to display the remove button!!
//                                        },
//                                        error: function (data, errorCode, errorMessage) {
//                                            displayAlertDialog('Error looking up PM User Id.');
//                                            WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'Error looking up PM User Id.: ' + errorCode + ', ' + errorMessage);
//                                            redirectForm();
//                                        }
//                                    });
//                                    break;
//                                default:
//                                    displayAlertDialog('The workflow is in an invalid state. Try again in a couple of minutes.');
//                                    //WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The workflow is in an invalid state. Try again in a couple of minutes. 001');
//                                    redirectForm(appweburl);
//                            }
//                        }
//                    //});
//                    }

//                } else {
//                    displayAlertDialog('The workflow is in an invalid state. Try again in a couple of minutes.');
//                    //WriteToErrorLog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', 'The workflow is in an invalid state. Try again in a couple of minutes. 002');
//                    redirectForm(appweburl);
//                }
//            },
//            error: function (data, errorCode, errorMessage) {
//                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
//                displayAlertDialog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', '1:' + errorCode + ', ' + errorMessage);
//            }
//        });
//    } catch (e) {
//        //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '2:' + e.message);
//        displayAlertDialog('Error in bw.core.js.displayForm_DisplayArBasedOnWorkflowStatus()', '2:' + e.message);
//    }
//}

function displayForm_DisplayRecurringExpense(recurringExpenseId, action, participantId) {
    // This displays the recurring expense form so that the user can submit the new budget request, and update the recurring expense reminder date.
    var test = appweburl;
    var test2 = appweburl2;
    //var filename = recurringExpenseId;

    //displayAlertDialog('displayForm_DisplayRecurringExpense()');

    var operationUri = webserviceurl + "/bwrecurringexpense/" + recurringExpenseId; // bwrecurringexpense/:bwRecurringExpenseId
    try {
        $.ajax({
            url: operationUri,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {


                //displayAlertDialog('displayForm_DisplayRecurringExpense(). data: ' + JSON.stringify(data));

                // We need to get the following from the returned BwBudgetRequest data element.
                //var userId = participantId; //9; //_spPageContextInfo.userId;

                //var functionalAreaId = data.d.results[0].FunctionalAreaId; //1;
                //var pmAccountId = data.d.results[0].ManagerId; //9;
                //var arStatus = data.d.results[0].ARStatus; //'Submitted';
                //var workflowStatus = data.d.results[0].BudgetWorkflowStatus; //'Assign Budget';
                var xml = data.d.results[0].bwDocumentXml
                //bwApprovalLevelWorkflowToken = data.d.results[0].bwApprovalLevelWorkflowToken; // global declared in my.js

                //var pmUserId = data.d.results[0][0].ManagerId;

                var file = "";
                var status = "";


                var xmlUndefined = false; // Doing this to be compatible with IE8 which doesn't know how to test undefined on this object for some reason.
                try {
                    if (xml == 'undefined') xmlUndefined = true;
                } catch (e) {
                    // no action necessary.
                }
                if ((xml == null) || xmlUndefined) {
                    displayAlertDialog('Error loading the file.');
                    WriteToErrorLog('Error in bw.core.js.displayForm_DisplayRecurringExpense().', 'loadXML() failed for file: ' + appweburl + '/Lists/BudgetRequests/' + recurringExpenseId);
                    redirectForm();
                } else {
                    //$.ajax({
                    //    url: webserviceurl + "/_api/web/lists/getbytitle('BudgetRequests')/items",
                    //    method: "GET",
                    //    headers: { "Accept": "application/json; odata=verbose" },
                    //    success: function (data) {
                    status = "";
                    var xslFile = "";
                    xslFile = "/" + viewsFolderName + "/RecurringExpenseEditForm.xsl";
                    file = appweburl2 + xslFile;

                    //displayAlertDialog('appweburl2: ' + appweburl2);

                    status = '<img class="imgRedDot" alt="" src="/images/red-dot.png"> Enter the necessary details then click the "Submit the AR" button.';
                    var xsl = null;
                    try //Internet Explorer
                    {
                        xsl = new ActiveXObject("Microsoft.XMLDOM");
                        xsl.async = false;
                        xsl.load(file);
                    }
                    catch (e) {
                        try //Firefox, Mozilla, Opera, etc.
                        {
                            xsl = document.implementation.createDocument("", "", null);
                            xsl.async = false;
                            xsl.load(file);
                        }
                        catch (e) {
                            try //Google Chrome
                            {
                                var xmlhttp = new window.XMLHttpRequest();
                                xmlhttp.open("GET", file, false);
                                xmlhttp.send(null);
                                xsl = xmlhttp.responseXML.documentElement;
                            }
                            catch (e) {
                                displayAlertDialog('Failure attempting to parse XSLT in the browser.');
                                WriteToErrorLog('Error in bw.core.js.displayForm_DisplayRecurringExpense()', 'Resubmit: Failure attempting to parse XSLT in the browser: ' + e.name + ', ' + e.message + ', ' + e.stack);
                                redirectForm();
                            }
                        }
                    }

                    try {
                        var s = TransformToHtmlText(xml, xsl);
                    } catch (e) {
                        displayAlertDialog('Error in bw.core.js.displayForm_DisplayRecurringExpense().TransformToHtmlText(): ' + e.message + ', ' + e.stack);
                    }

                    //displayAlertDialog('s: ' + s);

                    //$('#myxml').append(s);
                    document.getElementById('myxml').innerHTML = s; // Todd is this where the duplicate display is happening? Is this code getting called twice? Was it just append? 4-9-18 6am ast

                    //// Now we have to generate a new BudgetRequestId guid. This is necessary so that if attachments are added, the system has a place to put them.
                    //var _budgetRequestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    //    return v.toString(16);
                    //});
                    //document.getElementById('BudgetRequestId').innerHTML = _budgetRequestId;


                    //$('#dtRecurringExpenseNextReminderDate').datepicker();
                    //$('#dtEstimatedStartDatex').datepicker();
                    //$('#dtEstimatedEndDatex').datepicker();
                    decodeUriInAllFields();
                    formatRequestedExpense();
                    formatRequestedCapital();
                    populateFunctionalAreasForAssignBudgetEditForm();

                    //populateAttachments(workflowAppId, recurringExpenseId, 'attachmentsInXslForm', true);


                    $('#dtRecurringExpenseNextReminderDate').change(function () {
                        // We do this to enable or disable the Save button as appropriate. Also we validate it here.
                        var recurringExpenseReminderDate = document.getElementById('dtRecurringExpenseNextReminderDate').value;


                        if (recurringExpenseReminderDate != '') {
                            // Validate.
                            var dateFromSelection = new Date(recurringExpenseReminderDate); // Instantiate the object to see if there are any errors.
                            var d = dateFromSelection.getDate() + 1; // zero based
                            var m = dateFromSelection.getMonth();
                            var y = dateFromSelection.getFullYear();
                            var formulatedDate = new Date(y, m, d);
                            if (((formulatedDate.getDate() == d) && (formulatedDate.getMonth() == m) && (formulatedDate.getFullYear() == y))) {
                                var today = new Date(); // It's a valid date, but we need to check if it's before Today!!
                                // Todd added fix #9-8-14-002 to bw.initar.core.js.
                                today.setHours(0, 0, 0, 0);
                                formulatedDate.setHours(0, 0, 0, 0);
                                if (formulatedDate <= today) {
                                    //validation = false;

                                    // Todd: This event works weird, so we are just using it to enable/disable the save button. No dialogs, they just disturb the user.
                                    //displayAlertDialog('Please specify an "Reminder Date" which occurs in the future before submitting your request.');

                                    //displayAlertDialog('recurringExpenseReminderDate: ' + recurringExpenseReminderDate + ', formulatedDate: ' + formulatedDate + ', today: ' + today);

                                    // Bad date, clear the box.
                                    //document.getElementById('dtRecurringExpenseNextReminderDate').value = '';
                                } else {
                                    // It's good, set the style of the Save button!
                                    document.getElementById('btnRecurringExpenseNextReminderDate').style.cursor = 'pointer';
                                    document.getElementById('btnRecurringExpenseNextReminderDate').removeAttribute('disabled');
                                }
                            } else {
                                // Bad date, clear the box.
                                document.getElementById('dtRecurringExpenseNextReminderDate').value = '';
                            }
                        } else {
                            document.getElementById('btnRecurringExpenseNextReminderDate').style.cursor = 'default';
                            document.getElementById('btnRecurringExpenseNextReminderDate').setAttribute('disabled', '');
                        }
                    });


                }



            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in bw.core.js.displayForm_DisplayRecurringExpense()', '1:' + errorCode + ', ' + errorMessage);
            }
        });
    } catch (e) {
        //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '2:' + e.message);
        displayAlertDialog('Error in bw.core.js.displayForm_DisplayRecurringExpense()', '2:' + e.message);
    }
}



function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.slice(1) + "ListItem";
}

function getQueryStringParameter(paramToRetrieve) {
    var params = window.location.href.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}

//function getQueryStringParameterWithHashSign(paramToRetrieve) {
//    try {
//        var params = window.location.href.split("#")[1].split("&");
//        var strParams = "";
//        for (var i = 0; i < params.length; i = i + 1) {
//            var singleParam = params[i].split("=");
//            if (singleParam[0] == paramToRetrieve)
//                return singleParam[1];
//        }
//    } catch (e) {
//        displayAlertDialog('Error in bw.core.js.getQueryStringParameterWithHashSign(): ' + e.message);
//    }
//}

function loadXML(path, callback) {
    var request;

    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e1) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e2) {
                //
            }
        }
    }

    if (!request) {
        window.displayAlertDialog("No ajax support.");
        return false;
    }

    //Upon completion of the request, execute the callback.
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                displayAlertDialog('in loadxml request:' + request.responseXML);
                callback(request.responseXML);
            } else {
                window.displayAlertDialog("Could not load " + path);
            }
        }
    };
    request.open("GET", path);
    request.send();
}

function populateAttachments2(showRemoveButton) {

    console.log('Starting bw.core.js.populateAttachments2(' + showRemoveButton + ').');

    // Populate the attachments at the bottom of the form.
    var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
    var operationUri = appweburl + "/_api/web/getfolderbyserverrelativeurl('Lists/BudgetRequestAttachments/" + attachmentsFolderName + "')/files";
    $.ajax({
        url: operationUri,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            // Now we iterate through all of the files and add them to the attachments list on the page.
            $('#attachments').empty();
            try {
                for (var i = 0; i < 50; i++) { // HARDCODED ATTACHMENT LIMIT OF 50.
                    var filename = data.d.results[i].Name;
                    var fileUrl = appweburl + "/Lists/BudgetRequestAttachments/" + attachmentsFolderName + "/" + filename;

                    $('#attachments').append("<span style=\"WIDTH: 100%; contentEditable=false;\" >");
                    $('#attachments').append("<a target=\"_blank\" href=\"" + fileUrl + "\">" + filename + "</a>");
                    if (showRemoveButton) $('#attachments').append("<input type=\"button\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "');\" />");
                    $('#attachments').append("</span></br>");
                }
            } catch (e) {
                //displayAlertDialog(e.number + ', "' + e.message + '"'); // Todd we need to work on this
            }

        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error accessing the attachments list.');
            WriteToErrorLog('Error in bw.core.js.populateAttachments()', 'Error accessing the attachments list: ' + errorCode + ', ' + errorMessage);
        }
    });
}

function populateArAttachments2(showRemoveButton) {
    // Populate the attachments at the bottom of the form.
    var attachmentsFolderName = $('span[xd\\:binding = "my:AttachmentsFolderName"]')[0].innerHTML;
    var operationUri = appweburl + "/_api/web/getfolderbyserverrelativeurl('Lists/ARAttachments/" + attachmentsFolderName + "')/files";
    $.ajax({
        url: operationUri,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            // Now we iterate through all of the files and add them to the attachments list on the page.
            $('#arattachments').empty();
            try {
                for (var i = 0; i < 50; i++) { // HARDCODED ATTACHMENT LIMIT OF 50.
                    var attFilename = data.d.results[i].Name;
                    var fileUrl = appweburl + "/Lists/ARAttachments/" + attachmentsFolderName + "/" + attFilename;
                    $('#arattachments').append("<span style=\"WIDTH: 100%; contentEditable=false;\" >");
                    $('#arattachments').append("<a target=\"_blank\" href=\"" + fileUrl + "\">" + attFilename + "</a>");
                    if (showRemoveButton) $('#arattachments').append("<input type=\"button\" id=\"removeBudgetRequestArAttachment" + i + "\" value=\"Remove\" onclick=\"removeArAttachment('" + attFilename + "');\" />");
                    $('#arattachments').append("</span></br>");
                }
            } catch (e) {
                //displayAlertDialog(e.number + ', "' + e.message + '"'); // todd we need to work on this
            }

        },
        error: function (data, errorCode, errorMessage) {
            displayAlertDialog('Error accessing the ARAttachments list.');
            WriteToErrorLog('Error in bw.core.js.populateArAttachments()', 'Error accessing the ARAttachments list: ' + errorCode + ', ' + errorMessage);
        }
    });
}

function recalculateCosts() {
    try {
        // 1. Calculate Expenses

        //var expense1 = parseFloat($('span[xd\\:binding = "my:ExpenseEquipmentAndParts"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpExpense1 = "";
        try {
            tmpExpense1 = $('span[xd\\:binding = "my:ExpenseEquipmentAndParts"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpExpense1 = $('input[xd\\:binding = "my:ExpenseEquipmentAndParts"]')[0].value;
        }
        var expense1 = parseFloat(tmpExpense1.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        //var expense2 = parseFloat($('span[xd\\:binding = "my:ExpenseInternalLabor"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpExpense2 = "";
        try {
            tmpExpense2 = $('span[xd\\:binding = "my:ExpenseInternalLabor"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpExpense2 = $('input[xd\\:binding = "my:ExpenseInternalLabor"]')[0].value;
        }
        var expense2 = parseFloat(tmpExpense2.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        //var expense3 = parseFloat($('span[xd\\:binding = "my:ExpenseCostOfOutsideServices"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpExpense3 = "";
        try {
            tmpExpense3 = $('span[xd\\:binding = "my:ExpenseCostOfOutsideServices"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpExpense3 = $('input[xd\\:binding = "my:ExpenseCostOfOutsideServices"]')[0].value;
        }
        var expense3 = parseFloat(tmpExpense3.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        //var expense4 = parseFloat($('span[xd\\:binding = "my:OtherExpense"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpExpense4 = "";
        try {
            tmpExpense4 = $('span[xd\\:binding = "my:OtherExpense"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpExpense4 = $('input[xd\\:binding = "my:OtherExpense"]')[0].value;
        }
        var expense4 = parseFloat(tmpExpense4.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        var expenseTotal = 0;
        if (!isNaN(expense1)) expenseTotal += expense1;
        if (!isNaN(expense2)) expenseTotal += expense2;
        if (!isNaN(expense3)) expenseTotal += expense3;
        if (!isNaN(expense4)) expenseTotal += expense4;
        $('span[xd\\:binding = "my:ExpenseTotal"]')[0].innerHTML = formatCurrency(expenseTotal);

        // 2. Calculate Costs

        //var cost1 = parseFloat($('span[xd\\:binding = "my:CostOfEquipmentAndParts"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpCost1 = "";
        try {
            tmpCost1 = $('span[xd\\:binding = "my:CostOfEquipmentAndParts"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpCost1 = $('input[xd\\:binding = "my:CostOfEquipmentAndParts"]')[0].value;
        }
        var cost1 = parseFloat(tmpCost1.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        //var cost2 = parseFloat($('span[xd\\:binding = "my:CostOfInternalLabor"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpCost2 = "";
        try {
            tmpCost2 = $('span[xd\\:binding = "my:CostOfInternalLabor"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpCost2 = $('input[xd\\:binding = "my:CostOfInternalLabor"]')[0].value;
        }
        var cost2 = parseFloat(tmpCost2.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        //var cost3 = parseFloat($('span[xd\\:binding = "my:CostOfOutsideServices"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpCost3 = "";
        try {
            tmpCost3 = $('span[xd\\:binding = "my:CostOfOutsideServices"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpCost3 = $('input[xd\\:binding = "my:CostOfOutsideServices"]')[0].value;
        }
        var cost3 = parseFloat(tmpCost3.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        //var cost4 = parseFloat($('span[xd\\:binding = "my:OtherCapital"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpCost4 = "";
        try {
            tmpCost4 = $('span[xd\\:binding = "my:OtherCapital"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpCost4 = $('input[xd\\:binding = "my:OtherCapital"]')[0].value;
        }
        var cost4 = parseFloat(tmpCost4.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        //var cost5 = parseFloat($('span[xd\\:binding = "my:SalesTax"]')[0].innerHTML.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)
        var tmpCost5 = "";
        try {
            tmpCost5 = $('span[xd\\:binding = "my:SalesTax"]')[0].innerHTML;
        } catch (e) {
            // This means it is the iOS version.
            tmpCost5 = $('input[xd\\:binding = "my:SalesTax"]')[0].value;
        }
        var cost5 = parseFloat(tmpCost5.replace(/[^0-9-.]/g, '')); // Removes non-numeric characters (except decimal point and minus sign)

        var costTotal = 0;
        if (!isNaN(cost1)) costTotal += cost1;
        if (!isNaN(cost2)) costTotal += cost2;
        if (!isNaN(cost3)) costTotal += cost3;
        if (!isNaN(cost4)) costTotal += cost4;
        if (!isNaN(cost5)) costTotal += cost5;
        $('span[xd\\:binding = "my:TotalCosts"]')[0].innerHTML = formatCurrency(costTotal);

        // 3. Calculate AR Total
        var arTotal = 0;
        if (!isNaN(expenseTotal)) arTotal += expenseTotal;
        if (!isNaN(costTotal)) arTotal += costTotal;
        $('span[xd\\:binding = "my:CapitalTotal"]')[0].innerHTML = formatCurrency(arTotal);
    } catch (e) {
        // This try-catch statement allows us to fail gracefully. This method is not always needed!
    }
}

function cmdCreateSupplementalAr(budgetRequestId, functionalAreaId, pmAccountId, brTitle) {

    // Try to close this in case it is open.
    try {
        $('#ArDialog').dialog("close");
    } catch (e) {
    }


    $('#bwQuickLaunchMenuTd').css({
        width: '0'
    }); // This gets rid of the jumping around.

    $('#liWelcome').hide();
    $('#liArchive').hide();
    $('#liSummaryReport').hide();
    $('#liConfiguration').hide();
    $('#liHelp').hide();
    $('#liNewRequest').show();

    var e1 = document.getElementById('divNewRequestMasterDiv');
    e1.style.borderRadius = '20px 0 0 20px';

    $('#divWelcomeMasterDivTitle').text('New Supplemental Request'); // + budgetRequestId); // + budgetRequestId);

    //$('#divWelcomePageLeftButtonsWelcomeButton').css({
    //    'height': '28px', 'width': '92%', 'white-space': 'nowrap', 'border-radius': '0 0 0 0', 'padding': '12px 0 0 20px', 'margin': '0 0 0 0', 'border-width': '0 0 0 0', 'background-color': '#6682b5', 'color': 'white', 'outline': 'none', 'cursor': 'pointer'
    //});

    renderLeftButtons('divNewRequestPageLeftButtons');

    $('#divNewRequestPageLeftButtonsWelcomeButton').off('click').click(function () {
        renderWelcomeScreen();
    });

    renderNewSupplementalBudgetRequestForm(budgetRequestId, functionalAreaId, pmAccountId, brTitle);
}

function redirectForm(redirectUrl) {
    //if (redirectUrl == null || redirectUrl == '') {
    //    var source = getUrlParams()["Source"];
    //    if (source == null || source == '') window.location = appweburl2 + "/my.html"; //"?SPAppWebUrl=" + appweburl; // + "&SPHostUrl=" + hostweburl;
    //    else window.location = source;
    //} else {
    //    window.location = redirectUrl;
    //}


    try {
        if (appHasBeenLaunchedFromEmailForThisRequestId != '') {
            appHasBeenLaunchedFromEmailForThisRequestId = ''; // We are doing this because when the "Close" button is clicked on a form, sometimes it has to be clicked twice to get the form to go away and show the welcome screen again.
        }
    } catch (e) {

    }


    //window.location = 'my.html';
    //populateStartPageItem('divWelcome', 'Reports', '');
    //displayAlertDialog('reditect form');

    // Check if the user came here from an email link. Treat it differently if so!!
    var requestId1 = '';
    try {
        requestId1 = getUrlParams()["request"].toString().split('#')[0];
    } catch (e) {

    }
    if (requestId1 != '') {
        alert('Setting window.location. xcx213124-3.');
        window.location = 'my.html?logontype=' + participantLogonType;
        //renderWelcomeScreen();
    } else {
        renderWelcomeScreen();
    }


}

function retrieveFormDigest() {
    //Retrieve the form digest value.
    $(function () {
        var contextInfoUri = appweburl + "/_api/contextinfo";
        $.ajax({
            url: contextInfoUri,
            method: "POST",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                formDigestValue = data.d.GetContextWebInformation.FormDigestValue;
                //$('#__REQUESTDIGEST').val(data.g.GetContextWebInformation.FormDigestValue);
            },
            error: function (data, errorCode, errorMessage) {
                displayAlertDialog('Error retrieving the form digest value.');
                WriteToErrorLog('Error in bw.core.js.retrieveFormDigest()', 'Error retrieving the form digest value: ' + errorCode + ', ' + errorMessage);
            }
        })
    })
}

function getCreatedTimestamp() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var created = year + '-' + month + '-' + day + 'T' + hour + ':' + minutes + ':' + seconds;
    return created;
}

function getDueDateTimestamp() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var dueDay = now.getDate() + 1;
    var dueDate = year + '-' + month + '-' + dueDay + 'T:' + hour + ':' + minutes + ':' + seconds;
    return dueDate;
}

function TransformToHtmlText(xml, xsltDoc) {
    //var xmlDoc = $(xml); // This was added 1-27-16 to convert the string to a XmlDocument object.
    console.log('In bw.core.js.TransformToHtmlText()');
    //console.log('In bw.core.js.TransformToHtmlText(): xsltDoc: ' + xsltDoc);

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "application/xml");
    // 1.
    if (typeof (XSLTProcessor) != "undefined") {
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);
        var xmlFragment = xsltProcessor.transformToFragment(xmlDoc, document);

        if (typeof (GetXmlStringFromXmlDoc) != "undefined") {
            return GetXmlStringFromXmlDoc(xmlFragment);
        }
        else {
            // chrome friendly

            // get a xml serializer object
            var xmls = new XMLSerializer();

            // convert dom into string
            var sResult = xmls.serializeToString(xmlFragment);
            //extract contents of transform iix node if it is present
            if (sResult.indexOf("<transformiix:result") > -1) {
                sResult = sResult.substring(sResult.indexOf(">") + 1, sResult.lastIndexOf("<"));
            }
            return sResult;
        }
    }
    // 2.
    if (typeof (xmlDoc.transformNode) != "undefined") {
        return xmlDoc.transformNode(xsltDoc);
    }
    else {

        var activeXOb = null;
        try { activeXOb = new ActiveXObject("Msxml2.XSLTemplate"); } catch (ex) { }

        try {
            // 3
            if (activeXOb) {
                var xslt = activeXOb;
                var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
                xslDoc.loadXML(xsltDoc.xml);
                xslt.stylesheet = xslDoc;
                var xslProc = xslt.createProcessor();
                xslProc.input = xmlDoc;
                xslProc.transform();

                return xslProc.output;
            }
        }
        catch (e) {
            // 4
            displayAlertDialog('There was an error parsing XSLT.'); // not supported by this browser.');
            WriteToErrorLog('Error in bw.core.js.TransformToHtmlText()', 'There was an error parsing XSLT: ' + e.name + ', ' + e.message);
            WriteToErrorLog('Error in bw.core.js.TransformToHtmlText()', xml);
            return null;
        }

    }
}

var BW = window.BW || {};
BW.Jsom = BW.Jsom || {};

BW.Jsom.Libs = function () {

    var deferreds = new Array(),

    upload = function (library, filename, file) {
        deferreds[deferreds.length] = $.Deferred();
        getFileBuffer(file).then(
            function (buffer) {
                // Check if our attachments folder exists in the BudgetRequestAttachments library.
                var operationUri = appweburl + "/_api/web/getfolderbyserverrelativeurl('Lists/BudgetRequestAttachments/" + attachmentsFolderName + "')";
                $.ajax({
                    url: operationUri,
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        //var fileData = new SP.Base64EncodedByteArray();
                        var byteArr = new Uint8Array(buffer);
                        var fileData = "";
                        for (var i = 0; i < byteArr.byteLength; i++) {
                            fileData += String.fromCharCode(byteArr[i])
                        }

                        //var fileData = "";
                        //for (var i = 0; i < buffer.byteLength; i++) {
                        //    fileData.append(String.fromCharCode(buffer[i]));
                        //}

                        var operationUri = appweburl + "/_api/web/getfolderbyserverrelativeurl('Lists/BudgetRequestAttachments/" + attachmentsFolderName + "')/Files/Add(url='" + filename + "', overwrite=true)";
                        $.ajax({
                            url: operationUri,
                            method: "POST",
                            contentType: "application/json;odata=verbose",
                            binaryStringRequestBody: true,
                            data: fileData,
                            headers: {
                                "Accept": "application/json; odata=verbose",
                                "X-RequestDigest": formDigestValue,
                                "content-length": fileData.length
                            },
                            success: function (data) {
                                //populateAttachments(attachmentsFolderName, true);

                                console.log('In xcx23124232342-2 Calling clone.');
                                alert('In xcx23124232342-2 Calling clone.');

                                $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                                //displayAlertDialog('FILE UPLOADED!!!!!!!!!!!!!!');
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error uploading file to the attachments library.');
                                WriteToErrorLog('Error in bw.core.js.BW.Jsom.Libs.upload()', 'Error uploading file to the attachments library: ' + errorCode + ', ' + errorMessage);
                            }
                        });

                        //// 2. Add the file to the folder.
                        //var clientContext;
                        //var oWebsite;
                        //var oList;
                        //var fileCreateInfo;
                        //var fileContent;

                        //clientContext = new SP.ClientContext.get_current();
                        //oWebsite = clientContext.get_web();

                        //oList = oWebsite.get_lists().getByTitle("BudgetRequestAttachments");

                        //var fileCreateInfo = new SP.FileCreationInformation();
                        //fileCreateInfo.set_url(filename);
                        //fileCreateInfo.set_content(new SP.Base64EncodedByteArray()); //content);
                        //fileCreateInfo.set_overwrite(true);

                        //var byteArr = new Uint8Array(buffer);
                        //for (var i = 0; i < byteArr.length; i++) {
                        //    fileCreateInfo.get_content().append(byteArr[i]);
                        //}

                        ////var newFile = oList.get_rootFolder().get_files().add(fileCreateInfo);
                        //var newFile = oList.get_rootFolder().get_files().add(fileCreateInfo);
                        ////newFile.get_listItemAllFields().set_item("AProperty1", myproperty1);
                        ////newFile.get_listItemAllFields().set_item("AProperty2", myproperty2);

                        //newFile.get_listItemAllFields().update();
                        //clientContext.load(newFile);
                        //clientContext.executeQueryAsync(
                        //    function (sender, args) {
                        //        populateAttachments(); // Display the attachments on the form.
                        //        $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                        //    },
                        //    function (sender, args) {
                        //        displayAlertDialog(args.get_message());
                        //    });
                    },
                    error: function (data, errorCode, errorMessage) {
                        //displayAlertDialog('Our attachments folder does not exist. Creating the folder, and uploading the new attachment...');
                        // Create the folder in the BudgetRequestAttachments library.
                        var operationUri = appweburl + "/_api/web/folders/";
                        var bodyContent = "{ '__metadata': { 'type': 'SP.Folder' }, 'ServerRelativeUrl': 'Lists/BudgetRequestAttachments/" + attachmentsFolderName + "'}";
                        $.ajax({
                            url: operationUri,
                            method: "POST",
                            contentType: "application/json;odata=verbose",
                            data: bodyContent,
                            headers: {
                                "Accept": "application/json; odata=verbose",
                                "X-RequestDigest": formDigestValue,
                                "content-length": bodyContent.length
                            },
                            success: function (data) {
                                //var fileData = new SP.Base64EncodedByteArray();
                                var byteArr = new Uint8Array(buffer);
                                var fileData = "";
                                for (var i = 0; i < byteArr.byteLength; i++) {
                                    fileData += String.fromCharCode(byteArr[i])
                                }

                                //var fileData = "";
                                //for (var i = 0; i < buffer.byteLength; i++) {
                                //    fileData.append(String.fromCharCode(buffer[i]));
                                //}

                                var operationUri = appweburl + "/_api/web/getfolderbyserverrelativeurl('Lists/BudgetRequestAttachments/" + attachmentsFolderName + "')/Files/Add(url='" + filename + "', overwrite=true)";
                                $.ajax({
                                    url: operationUri,
                                    method: "POST",
                                    contentType: "application/json;odata=verbose",
                                    binaryStringRequestBody: true,
                                    data: fileData,
                                    headers: {
                                        "Accept": "application/json; odata=verbose",
                                        "X-RequestDigest": formDigestValue,
                                        "content-length": fileData.length
                                    },
                                    success: function (data) {
                                        //populateAttachments(attachmentsFolderName, true);

                                        console.log('In xcx23124232342-1 Calling clone.');
                                        alert('In xcx23124232342-1 Calling clone.');

                                        $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.

                                        //displayAlertDialog('FILE UPLOADED!!!!!!!!!!!!!!');
                                    },
                                    error: function (data, errorCode, errorMessage) {
                                        displayAlertDialog('Error uploading file to the attachments library.');
                                        WriteToErrorLog('Error in bw.core.js.BW.Jsom.Libs.upload()', '2:Error uploading file to the attachments library: ' + errorCode + ', ' + errorMessage);
                                    }
                                });
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error creating folder in attachments library.');
                                WriteToErrorLog('Error in bw.core.js.BW.Jsom.Libs.upload()', 'Error creating folder in attachments library: ' + errorCode + ', ' + errorMessage);
                            }
                        });
                    }
                });
            },
            function (err) {
                deferreds[deferreds.length - 1].reject(err);
            }
         );
        return deferreds[deferreds.length - 1].promise();
    },

    getFileBuffer = function (file) {
        var deferred = $.Deferred();
        var reader = new FileReader();
        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(file);
        return deferred.promise();
    };

    return {
        upload: upload,
    };

}();

function displayWorkingOnItDialog() {
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
}


function cmdInviteNewParticipant2() {
    // This is called from the home page.

    var created = getCreatedTimestamp();
    var data = {
        "bwTenantId": tenantId,
        "bwWorkflowAppId": workflowAppId,
        "bwWorkflowAppTitle": workflowAppTitle,
        "bwInvitationCreatedById": participantId,
        "bwInvitationCreatedByFriendlyName": participantFriendlyName,
        "bwInvitationCreatedByEmail": participantEmail,
        "bwInvitationCreatedTimestamp": created
    };
    // /participants/invite/:userinfo
    $.ajax({
        url: webserviceurl + "/participants/invite",
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + data;
            $('#invitationLink2').text(invitationUrl);

            cmdViewInvitation(data); // This displays the modal dialog.

            //displayAlertDialog(data);
        },
        error: function (data, errorCode, errorMessage) {
            //displayAlertDialog('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
            displayAlertDialog('Error in ios8.js.cmdInviteNewParticipant2():' + errorCode + ', ' + errorMessage + '::' + JSON.stringify(data));
        }
    });
}


function hideWorkingOnItDialog() {
    try {
        $('#divWorkingOnItDialog').dialog('close');
    } catch (e) { }
}





