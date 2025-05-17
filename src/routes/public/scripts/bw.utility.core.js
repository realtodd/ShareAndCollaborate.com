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


function encodeHtmlAttribute(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&quot;');
}







function formatRequestedExpense() {
    var x = formatCurrency($('span[xd\\:binding = "my:Requested_Expense"]')[0].innerHTML);
    $('span[xd\\:binding = "my:Requested_Expense"]')[0].innerHTML = x;
}


function formatRequestedCapital() {
    var x = formatCurrency($('span[xd\\:binding = "my:Requested_Capital"]')[0].innerHTML);
    $('span[xd\\:binding = "my:Requested_Capital"]')[0].innerHTML = x;
}


function formatRequestedExpense_InitBudgetRequest() {
    var x = formatCurrency(document.getElementById('dblRequestedExpense').value);
    document.getElementById('dblRequestedExpense').value = x;
}


function formatRequestedCapital_InitBudgetRequest() {
    var x = formatCurrency(document.getElementById('dblRequestedCapital').value);
    document.getElementById('dblRequestedCapital').value = x;
}


function formatMMDDYYYYDateForIos8(strDate) {
    // Convert MM/DD/YYYY to YYYY-MM-DD
    var result = '';
    try {
        var year = strDate.split('/')[2];
        var month = strDate.split('/')[0];
        var day = strDate.split('/')[1];
        result = year + '-' + month + '-' + day;
        if (result.indexOf('undefined') > -1) result = ''; // // This makes sure that undefined does not get returned.
    } catch (e) {
        // do nothing
        result = ''; // This makes sure that undefined does not get returned.
    }
    return result;
}

function formatCurrency2WithoutDollarSign(binding) {
    var content = $('input[xd\\:binding = "' + binding + '"]')[0].value //.trim();
    if (content === "" || content === "0" || content === "$0.00" || content === "NaN") {
        $('input[xd\\:binding = "' + binding + '"]')[0].value = "";
    } else {
        var x = formatCurrencyWithoutDollarSign(content);
        $('input[xd\\:binding = "' + binding + '"]')[0].value = x;
    }
    recalculateCosts();
}


function formatBudgetAmount() {
    //var ba = $('span[xd\\:binding = "my:Budget_Amount2"]')[0].innerHTML;
    //if (ba != "") {
    //    var x = formatCurrency($('span[xd\\:binding = "my:Budget_Amount2"]')[0].innerHTML);
    //    $('span[xd\\:binding = "my:Budget_Amount2"]')[0].innerHTML = x;
    //}
    try {
        //displayAlertDialog('in formatBudgetAmount()');
        var ba = $('#txtBudget_Amount2').val(); //inputBox.val();
        //displayAlertDialog('ba:' + ba);
        if (ba != "") {
            var x = formatCurrency(ba);
            //displayAlertDialog('x:' + x);
            $('#txtBudget_Amount2').val = x.split('$')[1]; // = x;
        }
    } catch (e) {
        displayAlertDialog('Error in bw.core.js.formatBudgetAmount():' + e.message);
    }
}



function isNumberGreaterThanZero(n) {
    var result = false;
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        var x = parseFloat(n);
        if (x <= 0) {
            result = false; // The number is less than or equal to zero.
        } else {
            result = true;
        }
    } else {
        result = false; // n is NaN (not a number).
    }
    return result;
}

function formatCurrency(num) {
    //num = num.toString().replace(/\$|\,/g, '');
    //if (isNaN(num))
    //    num = "0";
    //var sign = (num == (num = Math.abs(num)));
    //num = Math.floor(num * 100 + 0.50000000001);
    //var cents = num % 100;
    //num = Math.floor(num / 100).toString();
    //if (cents < 10)
    //    cents = "0" + cents;
    //for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
    //    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
    //    num.substring(num.length - (4 * i + 3));
    //return (((sign) ? '' : '-') + '$' + num + '.' + cents);



    // selectedCurrencySymbol. Values include: Dollar, Pound, Euro, Rand, Franc, Yen, Rouble, Peso, Rupee, Guilder.
    // Now we have to disable the button for the page we are on at the moment.
    var currencySymbol = '';
    switch (selectedCurrencySymbol) {
        case 'Dollar':
            currencySymbol = '$';
            break;
        case 'Pound':
            currencySymbol = '£';
            break;
        case 'Euro':
            currencySymbol = '€';
            break;
        case 'Rand':
            currencySymbol = 'R';
            break;
        case 'Franc':
            currencySymbol = '₣';
            break;
        case 'Yen':
            currencySymbol = '¥';
            break;
        case 'Rouble':
            currencySymbol = '₽';
            break;
        case 'Peso':
            currencySymbol = '₱';
            break;
        case 'Rupee':
            currencySymbol = '₹';
            break;
        case 'Guilder':
            currencySymbol = 'ƒ';
            break;
        default:
            currencySymbol = '$';
            break;
    }

    if (num) {
        //num = num.toString().replace(/\$|\,/g, '');
        num = num.toString().replace(/\$|\,/g, '');

        num = num.toString().replace(/\£|\,/g, '');
        num = num.toString().replace(/\€|\,/g, '');
        num = num.toString().replace(/\R|\,/g, '');
        num = num.toString().replace(/\₣|\,/g, '');
        num = num.toString().replace(/\¥|\,/g, '');
        num = num.toString().replace(/\₽|\,/g, '');
        num = num.toString().replace(/\₱|\,/g, '');
        num = num.toString().replace(/\₹|\,/g, '');
        num = num.toString().replace(/\ƒ|\,/g, '');

        if (isNaN(num))
            num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + currencySymbol + num + '.' + cents);
    } else {
        return currencySymbol + '0.00'; //0; // This was 0 but I changed it 4-15-18 3-36am ast.
    }
}

function formatCurrencyReturnEmptyForZero(num) {

    // selectedCurrencySymbol. Values include: Dollar, Pound, Euro, Rand, Franc, Yen, Rouble, Peso, Rupee, Guilder.
    // Now we have to disable the button for the page we are on at the moment.
    var currencySymbol = '';
    switch (selectedCurrencySymbol) {
        case 'Dollar':
            currencySymbol = '$';
            break;
        case 'Pound':
            currencySymbol = '£';
            break;
        case 'Euro':
            currencySymbol = '€';
            break;
        case 'Rand':
            currencySymbol = 'R';
            break;
        case 'Franc':
            currencySymbol = '₣';
            break;
        case 'Yen':
            currencySymbol = '¥';
            break;
        case 'Rouble':
            currencySymbol = '₽';
            break;
        case 'Peso':
            currencySymbol = '₱';
            break;
        case 'Rupee':
            currencySymbol = '₹';
            break;
        case 'Guilder':
            currencySymbol = 'ƒ';
            break;
        default:
            currencySymbol = '$';
            break;
    }

    //num = num.toString().replace(/\$|\,/g, '');
    num = num.toString().replace(/\$|\,/g, '');

    num = num.toString().replace(/\£|\,/g, '');
    num = num.toString().replace(/\€|\,/g, '');
    num = num.toString().replace(/\R|\,/g, '');
    num = num.toString().replace(/\₣|\,/g, '');
    num = num.toString().replace(/\¥|\,/g, '');
    num = num.toString().replace(/\₽|\,/g, '');
    num = num.toString().replace(/\₱|\,/g, '');
    num = num.toString().replace(/\₹|\,/g, '');
    num = num.toString().replace(/\ƒ|\,/g, '');




    if (isNaN(num))
        num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    var cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    if (num == '0') return '';
    else return (((sign) ? '' : '-') + currencySymbol + num + '.' + cents);
    //else return (((sign) ? '' : '-') + '$' + num + '.' + cents); //
}



























function formatCurrencyNoDecimal(num) {
    //num = num.toString().replace(/\$|\,/g, '');
    //if (isNaN(num))
    //    num = "0";
    //var sign = (num == (num = Math.abs(num)));
    //num = Math.floor(num * 100 + 0.50000000001);
    //var cents = num % 100;
    //num = Math.floor(num / 100).toString();
    //if (cents < 10)
    //    cents = "0" + cents;
    //for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
    //    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
    //    num.substring(num.length - (4 * i + 3));
    //return (((sign) ? '' : '-') + '$' + num + '.' + cents);



    // selectedCurrencySymbol. Values include: Dollar, Pound, Euro, Rand, Franc, Yen, Rouble, Peso, Rupee, Guilder.
    // Now we have to disable the button for the page we are on at the moment.
    var currencySymbol = '';
    switch (selectedCurrencySymbol) {
        case 'Dollar':
            currencySymbol = '$';
            break;
        case 'Pound':
            currencySymbol = '£';
            break;
        case 'Euro':
            currencySymbol = '€';
            break;
        case 'Rand':
            currencySymbol = 'R';
            break;
        case 'Franc':
            currencySymbol = '₣';
            break;
        case 'Yen':
            currencySymbol = '¥';
            break;
        case 'Rouble':
            currencySymbol = '₽';
            break;
        case 'Peso':
            currencySymbol = '₱';
            break;
        case 'Rupee':
            currencySymbol = '₹';
            break;
        case 'Guilder':
            currencySymbol = 'ƒ';
            break;
        default:
            currencySymbol = '$';
            break;
    }

    if (num) {
        //num = num.toString().replace(/\$|\,/g, '');
        num = num.toString().replace(/\$|\,/g, '');

        num = num.toString().replace(/\£|\,/g, '');
        num = num.toString().replace(/\€|\,/g, '');
        num = num.toString().replace(/\R|\,/g, '');
        num = num.toString().replace(/\₣|\,/g, '');
        num = num.toString().replace(/\¥|\,/g, '');
        num = num.toString().replace(/\₽|\,/g, '');
        num = num.toString().replace(/\₱|\,/g, '');
        num = num.toString().replace(/\₹|\,/g, '');
        num = num.toString().replace(/\ƒ|\,/g, '');

        if (isNaN(num))
            num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + currencySymbol + num);
    } else {
        return currencySymbol + '0'; //0; // This was 0 but I changed it 4-15-18 3-36am ast.
    }
}

function formatCurrencyNoDecimalNoDollarSign(num) {
    //num = num.toString().replace(/\$|\,/g, '');
    //if (isNaN(num))
    //    num = "0";
    //var sign = (num == (num = Math.abs(num)));
    //num = Math.floor(num * 100 + 0.50000000001);
    //var cents = num % 100;
    //num = Math.floor(num / 100).toString();
    //if (cents < 10)
    //    cents = "0" + cents;
    //for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
    //    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
    //    num.substring(num.length - (4 * i + 3));
    //return (((sign) ? '' : '-') + '$' + num + '.' + cents);



    
    if (num) {
        //num = num.toString().replace(/\$|\,/g, '');
        num = num.toString().replace(/\$|\,/g, '');

        num = num.toString().replace(/\£|\,/g, '');
        num = num.toString().replace(/\€|\,/g, '');
        num = num.toString().replace(/\R|\,/g, '');
        num = num.toString().replace(/\₣|\,/g, '');
        num = num.toString().replace(/\¥|\,/g, '');
        num = num.toString().replace(/\₽|\,/g, '');
        num = num.toString().replace(/\₱|\,/g, '');
        num = num.toString().replace(/\₹|\,/g, '');
        num = num.toString().replace(/\ƒ|\,/g, '');

        if (isNaN(num))
            num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num);
    } else {
        return '0'; //0; // This was 0 but I changed it 4-15-18 3-36am ast.
    }
}

function formatCurrencyReturnEmptyForZeroNoDecimal(num) {

    // selectedCurrencySymbol. Values include: Dollar, Pound, Euro, Rand, Franc, Yen, Rouble, Peso, Rupee, Guilder.
    // Now we have to disable the button for the page we are on at the moment.
    var currencySymbol = '';
    switch (selectedCurrencySymbol) {
        case 'Dollar':
            currencySymbol = '$';
            break;
        case 'Pound':
            currencySymbol = '£';
            break;
        case 'Euro':
            currencySymbol = '€';
            break;
        case 'Rand':
            currencySymbol = 'R';
            break;
        case 'Franc':
            currencySymbol = '₣';
            break;
        case 'Yen':
            currencySymbol = '¥';
            break;
        case 'Rouble':
            currencySymbol = '₽';
            break;
        case 'Peso':
            currencySymbol = '₱';
            break;
        case 'Rupee':
            currencySymbol = '₹';
            break;
        case 'Guilder':
            currencySymbol = 'ƒ';
            break;
        default:
            currencySymbol = '$';
            break;
    }

    //num = num.toString().replace(/\$|\,/g, '');
    num = num.toString().replace(/\$|\,/g, '');

    num = num.toString().replace(/\£|\,/g, '');
    num = num.toString().replace(/\€|\,/g, '');
    num = num.toString().replace(/\R|\,/g, '');
    num = num.toString().replace(/\₣|\,/g, '');
    num = num.toString().replace(/\¥|\,/g, '');
    num = num.toString().replace(/\₽|\,/g, '');
    num = num.toString().replace(/\₱|\,/g, '');
    num = num.toString().replace(/\₹|\,/g, '');
    num = num.toString().replace(/\ƒ|\,/g, '');




    if (isNaN(num))
        num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    var cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    if (num == '0') return '';
    else return (((sign) ? '' : '-') + currencySymbol + num);
    //else return (((sign) ? '' : '-') + '$' + num + '.' + cents); //
}
























function formatCurrencyWithoutDollarSign(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    var cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}

//function formatCurrency2(binding) {
//    var content = $('span[xd\\:binding = "' + binding + '"]')[0].innerHTML.trim();
//    if (content === "" || content === "0" || content === "$0.00" || content === "NaN") {
//        $('span[xd\\:binding = "' + binding + '"]')[0].innerHTML = "";
//    } else {
//        var x = formatCurrency(content);
//        $('span[xd\\:binding = "' + binding + '"]')[0].innerHTML = x;
//    }
//    recalculateCosts();
//}

function formatCurrency2(binding) {
    try {
        var isIos = false;
        var content = "";
        try {
            content = $('span[xd\\:binding = "' + binding + '"]')[0].innerHTML.trim();
        } catch (e) {
            // This means it is the iOS version.
            content = $('input[xd\\:binding = "' + binding + '"]')[0].value;
            isIos = true;
        }

        try {
            if (content === "" || content === "0" || content === "$0.00" || content === "NaN") {
                if (isIos == true) {
                    $('input[xd\\:binding = "' + binding + '"]')[0].value = "";
                } else {
                    $('span[xd\\:binding = "' + binding + '"]')[0].innerHTML = "";
                }
            } else {
                if (isIos == true) {
                    var x = formatCurrencyWithoutDollarSign(content);
                    $('input[xd\\:binding = "' + binding + '"]')[0].value = x;
                } else {
                    var x = formatCurrency(content);
                    $('span[xd\\:binding = "' + binding + '"]')[0].innerHTML = x;
                }
            }
        } catch (e3) {
            WriteToErrorLog('bwm.core.js.formatCurrency2(' + binding + ')', 'Could not assign a value to this element. Message: ' + e3.message);
        }

        recalculateCosts();
    } catch (e) {
        // Log an exception!
        var source = 'bwm.core.js.formatCurrency2(' + binding + ')';
        var message = e.message + ' ' + e.stack;
        WriteToErrorLog(source, message);
    }
}


//function getUrlParams() {
//    var urlParams = {};
//    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
//        urlParams[key] = decodeURIComponent(value);
//    });
//    return urlParams;
//}
