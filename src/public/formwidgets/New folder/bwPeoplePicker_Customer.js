$.widget("bw.bwPeoplePicker_Customer", {
    options: {

        bwBudgetRequestId: null,

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.


        fieldTitle: 'Project Manager', // This is the title, which shows up on the form in the left column.

        jsonData: null,

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
        this.element.addClass("bwPeoplePicker_Customer");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            if (this.options.inFormsEditor != true) {
                this.options.bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            if (this.options.inFormsEditor == true) {
                //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                this.renderAndPopulatePeoplePicker_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == false) {
                this.renderAndPopulatePeoplePicker_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == true) {
                this.renderAndPopulatePeoplePicker();
            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker_Customer</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }

            console.log('In bwPeoplePicker_Customer._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker_Customer</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker_Customer.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwPeoplePicker_Customer")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwPeoplePicker_Customer.getData().');
            //debugger;
            //Come back and build out the JSON for this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-27-2020
            //var value = $(this.element).find('#txtProjectManagerName_' + this.options.elementIdSuffix)[0].value;


            var element = document.getElementById('spanCustomerList_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix);
            var customers = element.getElementsByClassName('divPeoplePicker_Participant');

            var customersJson = [];
            for (var i = 0; i < customers.length; i++) {
                //html += '&nbsp;' + customers[i].outerHTML; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
                debugger;
                //var customer = document.getElementById(customers[i].id);
                //var customer = $('#' + customers[i].id);
                //var participantId = customers[i].id.split('_')[2];

                var customer = customers[i];

                //var xx = customer.getElementsByClassName('bwParticipantId');

                var participantId = customer.getElementsByClassName('bwParticipantId')[0].value;//         $(customer).find('.bwParticipantId').value;
                var participantEmail = customer.getElementsByClassName('bwParticipantEmail')[0].value;  //$(customer).find('.bwParticipantEmail').value;
                var participantFriendlyName = customer.getElementsByClassName('bwParticipantFriendlyName')[0].innerHTML;  // $(customer).find('.bwParticipantFriendlyName').innerHTML;

                var customerJson = {
                    //bwDataRequired: true,
                    //tagName: 'span',
                    ParticipantId: participantId,
                    ParticipantEmail: participantEmail,
                    ParticipantFriendlyName: participantFriendlyName
                }
                customersJson.push(customerJson);
            }

            var value = JSON.stringify(customersJson);
            return value;

        } catch (e) {
            console.log('Exception in bwPeoplePicker_Customer.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_Customer.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwPeoplePicker_Customer.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwPeoplePicker_Customer.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_Customer.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwPeoplePicker_Customer.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwPeoplePicker_Customer.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_Customer.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    addCustomer: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, bwBudgetRequestId) { //elementIdSuffix will let us find everything!
        try {
            console.log('In bwPeoplePicker_Customer.addCustomer().');

            var elementIdSuffix = friendlyNameSourceField.split('_')[2]; // This ensures this method call works with the correct request form!!!

            var customerElement = document.getElementById('spanCustomer_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix);
            if (customerElement) {
                // The customer has already been selected, so do nothing.
            } else {

                var html = '';

                var element = document.getElementById('spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix); // spanCustomerList_8a78b500-298f-4f09-ad95-f2ee80ed83a1_3a9dbbb6-f426-4a6d-8395-1d615f9ce43a
                debugger;
                var customers = element.getElementsByClassName('divPeoplePicker_Participant');

                for (var i = 0; i < customers.length; i++) {
                    html += customers[i].outerHTML + '&nbsp;'; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
                }

                html += '                   <span id="spanCustomer_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';
                html += '                       <span class="bwParticipantFriendlyName" id="txtProjectManagerName_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;<span class="divPeoplePicker_Participant_Delete" style="color:red;display:inline-block;cursor:pointer !important;" ';
                html += '                           onclick="$(\'.bwPeoplePicker_Customer\').bwPeoplePicker_Customer(\'removeCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + selectedParticipantFriendlyName + '\', \'' + selectedParticipantId + '\', \'' + selectedParticipantEmail + '\', \'' + bwBudgetRequestId + '\');">X</span>&nbsp;';
                //html += '                       <input id="2txtProjectManagerName_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" />';
                html += '                       <input class="bwParticipantId" id="txtProjectManagerId_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" value="' + selectedParticipantId + '" />';
                html += '                       <input class="bwParticipantEmail" id="txtProjectManagerEmail_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" value="' + selectedParticipantEmail + '" />';
                html += '                   </span>';

                $('#spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix).html(html);
            }

            $('#PeoplePickerDialog').dialog('close');

        } catch (e) {
            console.log('Exception in bwPeoplePicker_Customer.addCustomer(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_Customer.addCustomer(): ' + e.message + ', ' + e.stack);
        }
    },
    removeCustomer: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, bwBudgetRequestId) { //elementIdSuffix will let us find everything!
        try {
            console.log('In bwPeoplePicker_Customer.removeCustomer().');

            //var budgetrequestform;
            //var budgetrequestforms = $('#budgetrequestform');
            //for (var i = 0; i < budgetrequestforms.length; i++) {
            //    var _budgetRequestId = $(budgetrequestforms[i])[0].getAttribute('bwbudgetrequestid');
            //    if (bwBudgetRequestId == bwBudgetRequestId) {
            //        // We found the form.
            //        budgetrequestform = $(budgetrequestforms[i])[0];
            //        break;
            //    }
            //}

            //if (!budgetrequestform) {

            //    displayAlertDialog('Error in removeCustomer(). Unexpected value for budgetrequestform: ' + budgetrequestform);

            //} else {


            var elementIdSuffix = friendlyNameSourceField.split('_')[2]; // This ensures this method call works with the correct request form!!!

            $('#spanCustomer_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix).remove(); // Remove the customer from the list.

            var html = '';

            var element = document.getElementById('spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix);
            var customers = element.getElementsByClassName('divPeoplePicker_Participant');

            for (var i = 0; i < customers.length; i++) {
                html += customers[i].outerHTML + '&nbsp;'; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
            }

            //html += '                   &nbsp;';
            //html += '                   <span id="spanCustomer_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';
            //html += '                       <span id="txtProjectManagerName_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;<span class="divPeoplePicker_Participant_Delete" style="color:red;display:inline-block;cursor:pointer !important;" ';
            //html += ' onclick="$(\'.bwPeoplePicker_Customer\').bwPeoplePicker_Customer(\'removeCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + selectedParticipantFriendlyName + '\', \'' + selectedParticipantId + '\', \'' + selectedParticipantEmail + '\');">X</span>&nbsp;';
            //html += '                       <input id="2txtProjectManagerName_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" />';
            //html += '                       <input id="txtProjectManagerId_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" />';
            //html += '                       <input id="txtProjectManagerEmail_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" />';
            //html += '                   </span>';
            ////html += '                   &nbsp;';

            $('#spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix).html(html);
            //}

        } catch (e) {
            console.log('Exception in bwPeoplePicker_Customer.removeCustomer(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_Customer.removeCustomer(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulatePeoplePicker: function () {
        try {
            console.log('In renderAndPopulatePeoplePicker().');
            var thiz = this;

            if (!this.options.bwBudgetRequestId) {

                displayAlertDialog('In renderAndPopulatePeoplePicker(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);

            } else {

                var html = '';

                html += '<table style="width:100%;">';
                html += '<tbody>';
                html += '   <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwPeoplePicker_Customer">';
                html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
                html += '           <span class="xdlabel" id="spanRequestForm_ManagerTitle" title="Customer sharing allows customers to view this request. Click the Save/Publish button to make this setting take effect." alt="" style="cursor:help;" >';
                html += '               Customer sharing';
                html += '           </span><span class="xdlabel">:</span>';

                if (this.options.inFormsEditor == true) {
                    html += '       <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
                } else if (this.options.renderAsARequiredField == true) {
                    html += '       <span style="color:red;font-size:medium;">*</span>';
                } else if (this.options.renderAsARequiredField == false) {
                    //
                }
                html += '       </td>';

                html += '       <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
                html += '           <span class="bwRequestJsonxx" bwfieldname="bwPeoplePicker_Customer" bwdatatype="customer" bwdatarequired="true">';
                html += '               <span id="spanCustomerList_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '" style="border:1px solid gray;height:30px;padding:5px 5px 10px 5px;background-color:white;width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></span>';
                html += '               &nbsp;';
                html += '               <img style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayPeoplePickerDialog\', \'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'\', \'customer\');" src="images/addressbook-icon35x35.png">';
                html += '           </span>';
                html += '       </td>';

                html += '   </tr>';
                html += '</tbody>';
                html += '</table>';

                // Render the html.
                if (this.options.inFormsEditor != true) {
                    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                    this.element.closest('tr').removeAttr('draggable');
                }
                this.element.html(html);

                var formElement = this.element.closest("#budgetrequestform");

                // Now we can hook up the Participant text box for autocomplete.
                $(formElement).find('#txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/workflow/" + workflowAppId + "/participants/" + request.term,
                            dataType: "json",
                            success: function (data) {
                                try {
                                    var searchArray = [];
                                    for (var i = 0; i < data.participants.length; i++) {
                                        searchArray[i] = data.participants[i].participant;
                                    }
                                    response(searchArray);
                                } catch (e) {
                                    console.log('Exception in bwPeoplePicker_Customer.renderAndPopulatePeoplePicker().autocomplete.source(): ' + e.message + ', ' + e.stack);
                                }
                            }
                        });
                    },
                    minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
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
                            var projectManagerName = this.value.split('|')[0];
                            var projectManagerId = this.value.split('|')[1];
                            var projectManagerEmail = this.value.split('|')[2];

                            if (projectManagerName.indexOf('undefined') > -1) {
                                document.getElementById('txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + thiz.options.elementIdSuffix).value = '';
                                document.getElementById('txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = '';
                                document.getElementById('txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = '';
                            } else {
                                document.getElementById('txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + thiz.options.elementIdSuffix).value = projectManagerName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                                document.getElementById('txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = projectManagerId;
                                document.getElementById('txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = projectManagerEmail;
                            }
                        } catch (e) {
                            console.log('Exception in bwPeoplePicker_Customer.renderAndPopulatePeoplePicker().autocomplete.close(): ' + e.message + ', ' + e.stack);
                        }
                    }
                });






                //// If we have jsonData, populate the element.
                //if (this.options.jsonData != null) {
                //    var dataElement = $(this.element).find('.bwRequestJson:first');
                //    var bwFieldName = $(dataElement).attr('bwfieldname');
                //    if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                //        var value = this.options.jsonData[bwFieldName].value;
                //        $(dataElement).val(value);
                //    }
                //}






               
                // If we have jsonData, populate the element.
                if (this.options.jsonData != null) {
                    console.log('In bwPeoplePicker_Customer.renderAndPopulatePeoplePicker(). WE HAVE JSON DATA!!!!');
                    //alert('In bwPeoplePicker_Customer.renderAndPopulatePeoplePicker(). WE HAVE JSON DATA!!!! this.options.jsonData: ' + JSON.stringify(this.options.jsonData));

                    //debugger;
                    //var dataElement = $(this.element).find('.bwRequestJson:first');
                    var bwFieldName = 'bwPeoplePicker_Customer'; //$(dataElement).attr('bwfieldname');

                    if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
                        

                        try {
                            var customers = JSON.parse(this.options.jsonData[bwFieldName].value);

                            var elementIdSuffix = this.options.elementIdSuffix;
                            var bwBudgetRequestId = this.options.bwBudgetRequestId;

                            var html = '';

                            //var element = document.getElementById('spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix); // spanCustomerList_8a78b500-298f-4f09-ad95-f2ee80ed83a1_3a9dbbb6-f426-4a6d-8395-1d615f9ce43a
                            //debugger;
                            //var customers = element.getElementsByClassName('divPeoplePicker_Participant');

                            for (var i = 0; i < customers.length; i++) {
                                //    html += customers[i].outerHTML + '&nbsp;'; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
                                //}

                                var selectedParticipantId = customers[i].ParticipantId;
                                var selectedParticipantEmail = customers[i].ParticipantEmail;
                                var selectedParticipantFriendlyName = customers[i].ParticipantFriendlyName;

                                var friendlyNameSourceField = 'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
                                var idSourceField = 'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
                                var emailSourceField = 'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;

                                html += '                   <span onclick="alert(\'xcx3425hdjh-1\');" id="spanCustomer_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';

                                // Delete/X
                                html += '                       <span class="bwParticipantFriendlyName" id="txtProjectManagerName_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;<span class="divPeoplePicker_Participant_Delete" style="color:red;display:inline-block;cursor:pointer !important;" ';
                                html += '                           onclick="$(\'.bwPeoplePicker_Customer\').bwPeoplePicker_Customer(\'removeCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + selectedParticipantFriendlyName + '\', \'' + selectedParticipantId + '\', \'' + selectedParticipantEmail + '\', \'' + bwBudgetRequestId + '\');">X</span>&nbsp;';

                                html += '                       <input class="bwParticipantId" id="txtProjectManagerId_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" value="' + selectedParticipantId + '" />';
                                html += '                       <input class="bwParticipantEmail" id="txtProjectManagerEmail_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" value="' + selectedParticipantEmail + '" />';
                                html += '                   </span>';
                                html += '&nbsp;';
                            }

                            $('#spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix).html(html);
                        } catch (e) {

                            console.log('');
                            console.log('Error in bwPeoplePicker_Customer.js.renderAndPopulatePeoplePicker(). There is an issue with the jsonData... not sure what it is but leaving this breadcrumb here for now...... 11-14-2022 this.options.jsonData: ' + JSON.stringify(this.options.jsonData));
                            console.log('');

                        }
                    }
                }
            }

        } catch (e) {
            console.log('Exception in renderAndPopulatePeoplePicker: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker_Customer</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker_Customer.renderAndPopulatePeoplePicker(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulatePeoplePicker_ReadOnly: function () {
        try {
            console.log('In renderAndPopulatePeoplePicker_ReadOnly().');
            var thiz = this;

            var html = '';
            html += '<table style="width:100%;">';
            html += '<tbody>';
            html += '   <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwPeoplePicker_Customer">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '           <span class="xdlabel" id="spanRequestForm_ManagerTitle">';
            html += '               Customer sharing';
            html += '           </span><span class="xdlabel">:</span>';
            if (this.options.inFormsEditor == true) {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '           <span class="bwRequestJsonxx" bwfieldname="bwPeoplePicker_Customer" bwdatatype="Participant" bwdatarequired="true">';
            html += '           <span id="spanCustomerList_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '" style="border:1px solid gray;height:30px;padding:5px 5px 10px 5px;background-color:white;width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></span>';
            //html += '               &nbsp;';
            //html += '               <img style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayPeoplePickerDialog\', \'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'\', \'customer\');" src="images/addressbook-icon35x35.png">';
            html += '           </span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);

            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {
                console.log('In bwPeoplePicker_Customer.renderAndPopulatePeoplePicker_ReadOnly(). WE HAVE JSON DATA!!!!');


                

                debugger;
                //var dataElement = $(this.element).find('.bwRequestJsonxx')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');

                if (!(this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value)) {

                    //console.log('There is no json data to display.');

                } else {
                    var customers = JSON.parse(this.options.jsonData[bwFieldName].value);

                    var elementIdSuffix = this.options.elementIdSuffix;
                    var bwBudgetRequestId = this.options.bwBudgetRequestId;

                    var html = '';

                    for (var i = 0; i < customers.length; i++) {
                        var selectedParticipantId = customers[i].ParticipantId;
                        var selectedParticipantEmail = customers[i].ParticipantEmail;
                        var selectedParticipantFriendlyName = customers[i].ParticipantFriendlyName;

                        var friendlyNameSourceField = 'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
                        var idSourceField = 'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
                        var emailSourceField = 'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;

                        html += '                   <span onclick="alert(\'xcx3425hdjh-2\');" id="spanCustomer_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';


                        html += '                       <span class="bwParticipantFriendlyName" id="txtProjectManagerName_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;';

                        html += '                       <input class="bwParticipantId" id="txtProjectManagerId_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" value="' + selectedParticipantId + '" />';
                        html += '                       <input class="bwParticipantEmail" id="txtProjectManagerEmail_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" value="' + selectedParticipantEmail + '" />';
                        html += '                   </span>';
                        html += '&nbsp;';
                    }

                    $('#spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix).html(html);

                }
            }


        } catch (e) {
            console.log('Exception in renderAndPopulatePeoplePicker_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker_Customer</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker_Customer.renderAndPopulatePeoplePicker_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }



});