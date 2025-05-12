
module.exports = function () {

    var mongoose = require('mongoose');
    //var imagePathPrefix = 'https://budgetworkflow.com';
    //var globalUrlPrefix = 'https://';
    //var globalUrl = 'budgetworkflow.com';

    var bwExceptionLogSchema = new mongoose.Schema({
        bwExceptionLogId: String, // Todd: Do we need a unique id? //{ type: String, index: { unique: true } }, 
        ErrorThreatLevel: String, // severe, high, elevated, guarded, low.
        Timestamp: { // 2-28-2022
            type: Date, index: true
        },
        Source: String, // This is the method that produced the exception.
        Message: String, // Exception message.
        ErrorCode: String, // This is the error code.
        bwTenantId: String,
        bwWorkflowAppId: String,
        bwExceptionLogIp: String,
        bwExceptionLogUserAgent: String,
        bwExceptionLogReferrer: String,
        bwExceptionLogUserLogonType: String,
        bwExceptionLogUserLogonTypeId: String,
        bwExceptionLogParticipantId: String,
        bwExceptionLogParticipantFriendlyName: String,
        bwExceptionLogParticipantEmail: String//, // removed 2-3-2022
        //bwExceptionLogPlaceholder1: String,
        //bwExceptionLogPlaceholder2: String,
        //bwExceptionLogPlaceholder3: String,
        //bwExceptionLogPlaceholder4: String,
        //bwExceptionLogPlaceholder5: String,
        //bwExceptionLogPlaceholder6: String,
        //bwExceptionLogPlaceholder7: String,
        //bwExceptionLogPlaceholder8: String,
        //bwExceptionLogPlaceholder9: String,
        //bwExceptionLogPlaceholder10: String
    })
    var BwExceptionLog = mongoose.model('BwExceptionLog', bwExceptionLogSchema);

    encodeHtmlAttribute = function (s) {
        return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&quot;');
    }

    formatCurrency = function (num) {
        console.log('In commondata.js.formatCurrency().');

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
        try {
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
        } catch (e) {
            var selectedCurrencySymbol = 'Dollar';
            currencySymbol = '$';
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

    bwinvitationsunclaimed = function (bwWorkflowAppId) {
        return new Promise(function (resolve, reject) {
            try {
                console.log('In commondata.js.bwinvitationsunclaimed().');

                //var bwTenantId = request.body.bwTenantId;
                //var bwWorkflowAppId = request.body.bwWorkflowAppId;
                var BwInvitation = mongoose.model('BwInvitation');
                BwInvitation.find({
                    bwWorkflowAppId: bwWorkflowAppId
                    //bwWorkflowAppId: bwWorkflowAppId, bwInvitationAcceptedById: {
                    //    $in: ['-1']
                    //}
                }, function (error, result) {
                    //BwInvitation.find({ bwTenantId: bwTenantId, bwWorkflowAppId: bwWorkflowAppId }, function (error, result) {
                    if (!error) {
                        resolve(result);
                    } else {
                        var msg = 'Error bwinvitationsunclaimed:1: ' + error;
                        // Exception section:
                        var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                        var source = 'bwinvitationsunclaimed()';
                        var errorCode = null;
                        var message = msg;
                        WriteToErrorLog(threatLevel, source, errorCode, message);
                        //
                        //var result = { message: msg };
                        resolve(msg);
                    }
                });
            } catch (e) {
                var msg = 'Error in bwinvitationsunclaimed:2: ' + e.message;
                // Exception section:
                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                var source = 'bwinvitationsunclaimed()';
                var errorCode = null;
                var message = msg;
                WriteToErrorLog(threatLevel, source, errorCode, message);
                //
                //var result = { message: msg };
                resolve(msg);
            }
        });
    }

    bwtasksoutstanding = function (bwWorkflowAppId, bwParticipantId, bwParticipantEmail) {
        return new Promise(function (resolve, reject) {
            try {

                //
                // This file exists on both the web and file services servers. Be careful not to lose the latest version!!!
                //

                console.log('');
                console.log('--------------');
                console.log('=============================================');
                console.log('In commondata.bwtasksoutstanding(). bwWorkflowAppId: ' + bwWorkflowAppId);
                console.log('=============================================');
                console.log('--------------');
                console.log('');

                var results = new Array();

                var BwWorkflowApp = mongoose.model('BwWorkflowApp');
                var BwWorkflowTask = mongoose.model('BwWorkflowTask');
                var BwBudgetRequest = mongoose.model('BwBudgetRequest');
                var BwRecurringExpense = mongoose.model('BwRecurringExpense');
                //var bwTenantId = request.body.bwTenantId;
                //var bwWorkflowAppId = request.body.bwWorkflowAppId;
                //var bwParticipantId = request.body.bwParticipantId;
                //var bwParticipantEmail = request.body.bwParticipantEmail;

                //console.log('In POST1 bwtasksoutstanding(). bwWorkflowAppId: ' + bwWorkflowAppId + ' bwParticipantId: ' + bwParticipantId);
                //console.log('REQUEST: ')
                //console.log(JSON.stringify(request.body))

                // First we have to check if recurring expenses is turned on!
                BwWorkflowApp.find({
                    bwWorkflowAppId: bwWorkflowAppId
                }, function (wafError, wafResult) {
                    try {
                        if (wafError) {

                            console.log('Error in BwWorkflowApp.find(): ' + wafError);
                            reject();
                        } else {
                            var bwRecurringExpensesEnabled = wafResult[0].bwRecurringExpensesEnabled;
                            //console.log('bwRecurringExpensesEnabled : ' + bwRecurringExpensesEnabled);


                            BwWorkflowTask.find({
                                bwWorkflowAppId: bwWorkflowAppId, bwPercentComplete: 0, bwAssignedToId: bwParticipantId, TrashBin: { $ne: true }
                            }, function (error, taskResult) {
                                try {
                                    if (error) {
                                        var msg = 'Error in /bwtasksoutstanding:1: ' + error;
                                        // Exception section:
                                        var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                                        var source = 'start.js.DELETE.bwtasksoutstanding()';
                                        var errorCode = null;
                                        var message = msg;
                                        WriteToErrorLog(threatLevel, source, errorCode, message);
                                        //
                                        //var results = { message: msg };
                                        reject(msg);
                                    } else {
                                        //console.log('Returning to the client ' + taskResult.length + ' outstanding tasks for bwWorkflowAppId: ' + bwWorkflowAppId + ', bwParticipantId: ' + bwParticipantId + '.');

                                        console.log('Home tab: Displaying ' + taskResult.length + ' tasks (' + bwParticipantEmail + ')');
                                        //console.log(JSON.stringify(taskResult));
                                        var findBudgetRequestsQuery = [];
                                        var findRecurringExpensesQuery = [];
                                        for (var i = 0; i < taskResult.length; i++) { // doesn't need wrap.
                                            if (taskResult[i]._doc.TaskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                                                findBudgetRequestsQuery.push(taskResult[i]._doc.bwRelatedItemId);
                                            } else if (taskResult[i]._doc.TaskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                                                findRecurringExpensesQuery.push(taskResult[i]._doc.bwRelatedItemId);
                                            }
                                        }
                                        BwBudgetRequest.find({
                                            bwBudgetRequestId: {
                                                $in: findBudgetRequestsQuery
                                            }, TrashBin: { $ne: true }
                                        }, function (error2, brResult) {
                                            if (error2) {
                                                var msg = 'Error in /bwtasksoutstanding:2: ' + error2;
                                                // Exception section:
                                                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                                                var source = 'start.js.DELETE.bwtasksoutstanding()';
                                                var errorCode = null;
                                                var message = msg;
                                                WriteToErrorLog(threatLevel, source, errorCode, message);
                                                //
                                                //var results = { message: msg };
                                                reject(msg);
                                            } else {
                                                BwRecurringExpense.find({
                                                    bwRecurringExpenseId: {
                                                        $in: findRecurringExpensesQuery
                                                    }, TrashBin: { $ne: true }
                                                }, function (refError, refResult) {
                                                    if (refError) {
                                                        var msg = 'Error in /bwtasksoutstanding:2-1: ' + refError;
                                                        // Exception section:
                                                        var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                                                        var source = 'start.js.DELETE.bwtasksoutstanding()';
                                                        var errorCode = null;
                                                        var message = msg;
                                                        WriteToErrorLog(threatLevel, source, errorCode, message);
                                                        //
                                                        //var results = { message: msg };
                                                        reject(msg);
                                                    } else {
                                                        //console.log('refResult.length: ' + refResult.length);
                                                        // Ok now populate it.
                                                        for (var i = 0; i < taskResult.length; i++) { // doesn't need wrap.
                                                            if (taskResult[i]._doc.TaskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                                                                // Get the information from the budget request. We have to iterate through the budget requests to make sure we match up the relatedItemId and the budgetRequestId.
                                                                for (var j = 0; j < brResult.length; j++) { // doesn't need wrap.
                                                                    if (brResult[j]._doc.bwBudgetRequestId == taskResult[i]._doc.bwRelatedItemId) {
                                                                        var task = {

                                                                            bwWorkflowTaskItemId: taskResult[i]._doc.bwWorkflowTaskItemId, // Added 12-23-2021
                                                                            bwTaskTitle: taskResult[i]._doc.bwTaskTitle,
                                                                            TaskType: taskResult[i]._doc.TaskType, //String, // BUDGET_REQUEST_WORKFLOW_TASK, RECURRING_EXPENSE_NOTIFICATION_TASK, 

                                                                            WorkflowStepId: taskResult[i]._doc.WorkflowStepId, //String, // Not currently used, but we need to move this towards using a GUID.????
                                                                            WorkflowStepName: taskResult[i]._doc.WorkflowStepName, // String, // eg: 'Collaboration'??????
                                                                            RoleCategory: taskResult[i]._doc.RoleCategory, //String, // Approver, Collaborator.

                                                                            bwStatus: taskResult[i]._doc.bwStatus,
                                                                            bwTaskOutcome: taskResult[i]._doc.bwTaskOutcome, ///String, // eg: Budget Assigned by Todd Hiltz
                                                                            bwPercentComplete: taskResult[i]._doc.bwPercentComplete,
                                                                            bwRelatedItemId: taskResult[i]._doc.bwRelatedItemId,

                                                                            Title: brResult[j]._doc.Title,
                                                                            ProjectTitle: brResult[j]._doc.ProjectTitle,

                                                                            OrgId: brResult[j]._doc.OrgId,
                                                                            OrgName: brResult[j]._doc.OrgName,

                                                                            BudgetAmount: brResult[j]._doc.BudgetAmount,
                                                                            RequestedCapital: brResult[j]._doc.RequestedCapital,
                                                                            RequestedExpense: brResult[j]._doc.RequestedExpense,
                                                                            FinancialAreaId: brResult[j]._doc.FunctionalAreaId,
                                                                            CreatedBy: brResult[j]._doc.CreatedBy,

                                                                            Created: taskResult[i]._doc.Created,
                                                                            bwDueDate: taskResult[i]._doc.bwDueDate,
                                                                            bwHasBeenProcessedByTheWorkflowEngine: taskResult[i]._doc.bwHasBeenProcessedByTheWorkflowEngine,
                                                                            bwAssignedTo: taskResult[i]._doc.bwAssignedTo,
                                                                            bwAssignedToId: taskResult[i]._doc.bwAssignedToId,
                                                                            bwWorkflowAppId: taskResult[i]._doc.bwWorkflowAppId,
                                                                            TaskType: taskResult[i]._doc.TaskType,

                                                                            DailyOverdueTaskNotificationDate: taskResult[i]._doc.DailyOverdueTaskNotificationDate,

                                                                            bwAssignedToRaciRoleAbbreviation: taskResult[i]._doc.bwAssignedToRaciRoleAbbreviation, // eg: PM
                                                                            bwAssignedToRaciRoleName: taskResult[i]._doc.bwAssignedToRaciRoleName // eg: Project Manager
                                                                        };
                                                                        results.push(task);
                                                                    }
                                                                }
                                                            } else if (taskResult[i]._doc.TaskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                                                                //if (taskMatchedWithBudgetRequest == false) { // THIS MUST BE A RECURRING EXPENSE TASK. CHECK IF ALLOWED TO DISPLAY.
                                                                //console.log('taskMatchedWithBudgetRequest == false, bwRecurringExpensesEnabled=' + bwRecurringExpensesEnabled);
                                                                if (bwRecurringExpensesEnabled == 'true') {
                                                                    console.log('bwRecurringExpensesEnabled == true, refResult.length: ' + refResult.length);
                                                                    for (var j = 0; j < refResult.length; j++) { // doesn't need wrap.
                                                                        console.log('refResult[j]._doc.bwRecurringExpenseId: ' + refResult[j]._doc.bwRecurringExpenseId + ', taskResult[i]._doc.bwRelatedItemId: ' + taskResult[i]._doc.bwRelatedItemId);
                                                                        if (refResult[j]._doc.bwRecurringExpenseId == taskResult[i]._doc.bwRelatedItemId) {

                                                                            var task = {
                                                                                bwTaskTitle: taskResult[i]._doc.bwTaskTitle,
                                                                                bwRelatedItemId: taskResult[i]._doc.bwRelatedItemId,
                                                                                bwStatus: taskResult[i]._doc.bwStatus,
                                                                                bwPercentComplete: taskResult[i]._doc.bwPercentComplete,

                                                                                //Title: brResult[j]._doc.Title,
                                                                                ProjectTitle: refResult[j]._doc.ProjectTitle,

                                                                                OrgId: refResult[j]._doc.OrgId,
                                                                                OrgName: refResult[j]._doc.OrgName,

                                                                                //BudgetAmount: brResult[j]._doc.BudgetAmount,
                                                                                //RequestedCapital: brResult[j]._doc.RequestedCapital,
                                                                                //RequestedExpense: brResult[j]._doc.RequestedExpense,
                                                                                FinancialAreaId: refResult[j]._doc.FunctionalAreaId,
                                                                                //CreatedBy: brResult[j]._doc.CreatedBy,

                                                                                Created: taskResult[i]._doc.Created,
                                                                                bwDueDate: taskResult[i]._doc.bwDueDate,
                                                                                bwHasBeenProcessedByTheWorkflowEngine: taskResult[i]._doc.bwHasBeenProcessedByTheWorkflowEngine,
                                                                                bwAssignedTo: taskResult[i]._doc.bwAssignedTo,
                                                                                bwAssignedToId: taskResult[i]._doc.bwAssignedToId,
                                                                                bwWorkflowAppId: taskResult[i]._doc.bwWorkflowAppId,
                                                                                TaskType: taskResult[i]._doc.TaskType,

                                                                                DailyOverdueTaskNotificationDate: taskResult[i]._doc.DailyOverdueTaskNotificationDate,

                                                                                bwAssignedToRaciRoleAbbreviation: taskResult[i]._doc.bwAssignedToRaciRoleAbbreviation, // eg: PM
                                                                                bwAssignedToRaciRoleName: taskResult[i]._doc.bwAssignedToRaciRoleName // eg: Project Manager
                                                                            };
                                                                            results.push(task);
                                                                        }
                                                                    }
                                                                }
                                                                //}
                                                            }
                                                        }
                                                        //console.log(JSON.stringify(results));
                                                        resolve(results);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                } catch (e) {
                                    console.log('Exception in post bwtasksoutstanding(): GGGGGGGGGGG: ' + e.message + ', ' + e.stack);
                                    reject();
                                }
                            });
                        }
                    } catch (e) {
                        var msg = 'Error in /bwtasksoutstanding:xcx43557: bwWorkflowAppId: ' + bwWorkflowAppId + ':' + e.message;
                        // Exception section:
                        var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                        var source = 'start.js.DELETE.bwtasksoutstanding()';
                        var errorCode = null;
                        var message = msg;
                        WriteToErrorLog(threatLevel, source, errorCode, message);
                        //
                        //var results = { message: msg };
                        reject(msg);
                    }
                });
            } catch (e) {
                var msg = 'Error in /bwtasksoutstanding:3: ' + bwParticipantId + ':' + e.message;
                // Exception section:
                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                var source = 'start.js.DELETE.bwtasksoutstanding()';
                var errorCode = null;
                var message = msg;
                WriteToErrorLog(threatLevel, source, errorCode, message);
                //
                //var results = { message: msg };
                reject(msg);
            }
        });
    }

    bwtenants = function (bwTenantId, bwWorkflowAppId) {
        return new Promise(function (resolve, reject) {
            try {
                console.log('In commondata.js.bwtenants().');

                //var bwTenantId = request.body.bwTenantId;
                //var bwWorkflowAppId = request.body.bwWorkflowAppId;
                var BwTenant = mongoose.model('BwTenant');
                BwTenant.find({
                    bwTenantId: bwTenantId, bwWorkflowAppId: bwWorkflowAppId
                }, function (error, result) {
                    if (!error) {
                        resolve(result);
                    } else {
                        var msg = 'Error in DELETE /bwtenants:1: ' + error;
                        // Exception section:
                        var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                        var source = 'start.js.DELETE.bwtenants()';
                        var errorCode = null;
                        var message = msg;
                        WriteToErrorLog(threatLevel, source, errorCode, message);
                        //
                        //var results = { message: msg };
                        reject(msg);
                    }
                });
            } catch (e) {
                var msg = 'Error in DELETE /bwtenants:2: ' + e.message;
                // Exception section:
                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                var source = 'start.js.DELETE.bwtenants()';
                var errorCode = null;
                var message = msg;
                WriteToErrorLog(threatLevel, source, errorCode, message);
                //
                //var results = { message: msg };
                reject(msg);
            }
        });
    }

    bwparticipants = function (bwWorkflowAppId) {
        return new Promise(function (resolve, reject) {
            try {
                console.log('In commondata.js.bwparticipants().');

                var BwWorkflowUser = mongoose.model('BwWorkflowUser');

                BwWorkflowUser.find({ bwWorkflowAppId: bwWorkflowAppId }, function (error, result) {
                    if (!error) {
                        resolve(result);
                    } else {

                        var msg = 'Error in commondata.js.bwparticipants():1: ' + error;
                        var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                        var source = 'commondata.js.bwparticipants()';
                        var errorCode = null;
                        WriteToErrorLog(threatLevel, source, errorCode, msg);

                        reject(msg);

                    }
                });

            } catch (e) {

                var msg = 'Exception in commondata.js.bwparticipants(): ' + e.message;
                var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                var source = 'commondata.js.bwparticipants()';
                var errorCode = null;
                WriteToErrorLog(threatLevel, source, errorCode, msg);

                reject(msg);

            }
        });
    }

    bwbudgetrequestspending = function (bwWorkflowAppId) {
        return new Promise(function (resolve, reject) {
            try {
                console.log('In commondata.js.bwbudgetrequestspending().');

                //var bwTenantId = request.body.bwTenantId;
                //var bwWorkflowAppId = request.body.bwWorkflowAppId;
                var BwBudgetRequest = mongoose.model('BwBudgetRequest');

                //
                // First we find all of them EXCEPT the ones waiting for PO# to be issued.



                // 8-25-2022: ALSO WE HAVE TO filter out new requests that have not been submitted yet. <<<<<<<<<<<<<<<<<<<<<<<<< BudgetWorkflowStatus:NOT_SUBMITTED
                BwBudgetRequest.find({
                    bwWorkflowAppId: bwWorkflowAppId, ARStatus: {
                        $nin: ['Completed', 'Approved', 'Rejected', 'Active']
                    }, BudgetWorkflowStatus: { $nin: ['NOT_SUBMITTED'] }, TrashBin: { $ne: true } // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                }, function (br1Error, br1Result) {
                    if (!br1Error) {
                        // Then we find any that are waiting for the PO# to be issued.
                        BwBudgetRequest.find({
                            bwWorkflowAppId: bwWorkflowAppId, ARStatus: 'Approved', BudgetWorkflowStatus: 'Procurement: Issue PO#', TrashBin: { $ne: true }
                        }, function (br2Error, br2Result) {
                            if (!br2Error) {
                                var data = {
                                    PendingBudgetRequests: br1Result, PendingPOBudgetRequests: br2Result
                                };
                                resolve(data)
                            } else {
                                var msg = 'Error in bwbudgetrequestspending():1: ' + br2Error;
                                // Exception section:
                                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                                var source = 'bwbudgetrequestspending()';
                                var errorCode = null;
                                var message = msg;
                                WriteToErrorLog(threatLevel, source, errorCode, message);
                                //
                                //var results = { message: msg };
                                reject(msg);
                            }
                        });
                    } else {
                        var msg = 'Exception in bwbudgetrequestspending():2: ' + br1Error;
                        // Exception section:
                        var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                        var source = 'Exception in bwbudgetrequestspending()()';
                        var errorCode = null;
                        var message = msg;
                        WriteToErrorLog(threatLevel, source, errorCode, message);
                        //
                        //var results = { message: msg };
                        reject(msg);
                    }
                });
            } catch (e) {
                var msg = 'Exception in bwbudgetrequestspending():3: ' + e.message;
                // Exception section:
                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                var source = 'bwbudgetrequestspending()';
                var errorCode = null;
                var message = msg;
                WriteToErrorLog(threatLevel, source, errorCode, message);
                //
                //var results = { message: msg };
                reject(msg);
            }
        });
    }

    mybudgetrequests = function (bwWorkflowAppId, bwParticipantId) {
        return new Promise(function (resolve, reject) {
            try {
                console.log('In commondata.js.mybudgetrequests().');

                //var bwTenantId = request.body.bwTenantId;
                //var bwWorkflowAppId = request.body.bwWorkflowAppId;
                //var bwParticipantId = request.body.bwParticipantId;
                var BwBudgetRequest = mongoose.model('BwBudgetRequest');
                // First we find all of them EXCEPT the ones waiting for PO# to be issued.
                BwBudgetRequest.find({
                    bwWorkflowAppId: bwWorkflowAppId, CreatedById: bwParticipantId, TrashBin: { $ne: true }
                }, function (br1Error, br1Result) {
                    if (!br1Error) {
                        var results = {
                            message: 'SUCCESS',
                            MyRequests: br1Result
                        };
                        resolve(results)
                    } else {
                        var msg = 'Error in mybudgetrequests():1: ' + br1Error;
                        // Exception section:
                        var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                        var source = 'start.js.DELETE.mybudgetrequests()';
                        var errorCode = null;
                        var message = msg;
                        WriteToErrorLog(threatLevel, source, errorCode, message);
                        //
                        var results = { message: msg };
                        reject(results);
                    }
                });
            } catch (e) {
                var msg = 'Exception in mybudgetrequests():2: ' + e.message;
                // Exception section:
                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                var source = 'start.js.DELETE.mybudgetrequests()';
                var errorCode = null;
                var message = msg;
                WriteToErrorLog(threatLevel, source, errorCode, message);
                //
                var results = { message: msg };
                reject(results);
            }
        });
    }

    //WriteToErrorLog = function (threatLevel, source, errorCode, message) {
    //    var bwExceptionLogEntryId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //        return v.toString(16);
    //    });

    //    console.log(message);

    //    var timestamp = new Date();
    //    var BwExceptionLog = mongoose.model('BwExceptionLog');
    //    var bwExceptionLog = new BwExceptionLog(
    //        {
    //            bwExceptionLogId: bwExceptionLogEntryId, // Todd: Do we need a unique id? //{ type: String, index: { unique: true } }, 
    //            ErrorThreatLevel: threatLevel, // severe, high, elevated, guarded, low.
    //            Timestamp: timestamp, // = new Date();
    //            Source: source, // This is the method that produced the exception.
    //            Message: 'xcx123123 webservices commondata.js:' + message, // Exception message.
    //            ErrorCode: errorCode //, // This is the error code.
    //            //bwTenantId: String,
    //            //bwWorkflowAppId: String,
    //            //bwExceptionLogIp: String,
    //            //bwExceptionLogUserAgent: String,
    //            //bwExceptionLogReferrer: String,
    //            //bwExceptionLogUserLogonType: String,
    //            //bwExceptionLogUserLogonTypeId: String,
    //            //bwExceptionLogParticipantId: String,
    //            //bwExceptionLogParticipantFriendlyName: String,
    //            //bwExceptionLogParticipantEmail: String,
    //        });
    //    bwExceptionLog.save(function (error) {
    //        if (!error) {
    //            bwExceptionLog.save();
    //        } else {
    //            console.log('Error in WriteToErrorLog(): ' + error);
    //        }
    //    });
    //}

    WriteToErrorLog = function (threatLevel, source, errorCode, message, bwWorkflowAppId, bwParticipantId, request) {
        try {
            if (!message) {

                console.log('***********************************');
                console.log('In commondata.js.WriteToErrorLog(). xcx123425 message: ' + message + '. NOT WRITING THIS ENTRY INVALID DATA.');
                console.log('***********************************');

            } else {

                console.log('***********************************');
                console.log('In commondata.js.WriteToErrorLog(). xcx123425 message: ' + message);
                console.log('***********************************');
                //

                var bwExceptionLogEntryId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                console.log(message);

                var ip = 'na';
                if (request) {
                    ip = request.headers['x-forwarded-for'] ||
                                     request.connection.remoteAddress ||
                                     request.socket.remoteAddress ||
                             (request.connection.socket ? request.connection.socket.remoteAddress : null
                             );
                }


                var timestamp = new Date();

                var bwExceptionLog = new BwExceptionLog(
                    {
                        bwExceptionLogId: bwExceptionLogEntryId, // Todd: Do we need a unique id? //{ type: String, index: { unique: true } }, 
                        ErrorThreatLevel: threatLevel, // severe, high, elevated, guarded, low.
                        Timestamp: timestamp, // = new Date();
                        Source: source, // This is the method that produced the exception.
                        Message: message, // Exception message.
                        ErrorCode: errorCode, // This is the error code.
                        bwWorkflowAppId: bwWorkflowAppId,
                        bwExceptionLogParticipantId: bwParticipantId,
                        //bwTenantId: String,
                        //bwWorkflowAppId: String,
                        bwExceptionLogIp: ip
                        //bwExceptionLogUserAgent: String,
                        //bwExceptionLogReferrer: String,
                        //bwExceptionLogUserLogonType: String,
                        //bwExceptionLogUserLogonTypeId: String,
                        //bwExceptionLogParticipantId: String,
                        //bwExceptionLogParticipantFriendlyName: String,
                        //bwExceptionLogParticipantEmail: String,
                    });

                //bwExceptionLogId: String, // Todd: Do we need a unique id? //{ type: String, index: { unique: true } }, 
                //ErrorThreatLevel: String, // severe, high, elevated, guarded, low.
                //Timestamp: Date, // = new Date();
                //Source: String, // This is the method that produced the exception.
                //Message: String, // Exception message.
                //ErrorCode: String, // This is the error code.
                //bwTenantId: String,
                //bwWorkflowAppId: String,
                //bwExceptionLogIp: String,
                //bwExceptionLogUserAgent: String,
                //bwExceptionLogReferrer: String,
                //bwExceptionLogUserLogonType: String,
                //bwExceptionLogUserLogonTypeId: String,
                //bwExceptionLogParticipantId: String,
                //bwExceptionLogParticipantFriendlyName: String,
                //bwExceptionLogParticipantEmail: String//, // removed 2-3-2022

                bwExceptionLog.save(function (error, mod) {
                    try {
                        if (!error) {
                            console.log(message);

                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('SUCCESS in WriteToErrorLog(): ' + JSON.stringify(bwExceptionLog));
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');

                        } else {
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('Error in WriteToErrorLog(): ' + error);
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        }
                    } catch (e) {
                        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        console.log('Exception in commondata.js.WriteToErrorLog():2: ' + e.message + ', ' + e.stack);
                        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                    }
                });
            }
        } catch (e) {
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log('Exception in commondata.js.WriteToErrorLog(): ' + e.message + ', ' + e.stack);
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        }
    }

    displayAlertDialog = function (msg) {
        // Don't need this on the server side, just push it to the console.
        console.log(msg);
    }



}