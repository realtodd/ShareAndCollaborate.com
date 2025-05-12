$.widget("bw.bwOperationalHours", {
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
        This is the bwOperationalHours.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        checkedColorClass: "WorkingDayState",
        uncheckedColorClass: "RestDayState",
        colorBoxValContainerClass: "colorBoxContainer",
        weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        //operationTime: [
        //    {},
        //    {},
        //    {},
        //    {},
        //    {},
        //    { isActive: false },
        //    { isActive: false }
        //],
        operationTimes: [
            { Weekday: 'Mon', TimeFrom: '9:00', TimeTill: '18:00', IsAllDay: false, IsActive: true },
            { Weekday: 'Tue', TimeFrom: '9:00', TimeTill: '18:00', IsAllDay: false, IsActive: true },
            { Weekday: 'Wed', TimeFrom: '9:00', TimeTill: '18:00', IsAllDay: false, IsActive: true },
            { Weekday: 'Thu', TimeFrom: '9:00', TimeTill: '18:00', IsAllDay: false, IsActive: true },
            { Weekday: 'Fri', TimeFrom: '9:00', TimeTill: '18:00', IsAllDay: false, IsActive: true },
            { Weekday: 'Sat', TimeFrom: '9:00', TimeTill: '18:00', IsAllDay: false, IsActive: false },
            { Weekday: 'Sun', TimeFrom: '9:00', TimeTill: '18:00', IsAllDay: false, IsActive: false }]
        ,
        operationTimes_DRAFT: [], // This is used so that we can tell if the Apply button should be enabled or not.
        defaultOperationTimeFrom: '9:00',
        defaultOperationTimeTill: '18:00',
        defaultActive: true,
        //labelOn: "Working day",
        //labelOff: "Day off",
        //labelTimeFrom: "from:",
        //labelTimeTill: "till:",
        containerTmpl: '<div class="clean"/>',
        dayTmpl: '<div class="dayContainer" style="width: 80px;">' +
            '<div data-original-title="" class="colorBox"><input type="checkbox" class="invisible operationState"></div>' +
            '<div class="weekday"></div>' +
            '<div class="operationDayTimeContainer">' +
            '<div class="operationTime input-group"><span class="input-group-addon"><i class="fa fa-sun-o"></i></span><input type="text" name="startTime" class="mini-time form-control operationTimeFrom" value=""></div>' +
            '<div class="operationTime input-group"><span class="input-group-addon"><i class="fa fa-moon-o"></i></span><input type="text" name="endTime" class="mini-time form-control operationTimeTill" value=""></div>' +
            '</div></div>'
    },
    _create: function () {
        this.element.addClass("bwOperationalHours");
        var thiz = this; // Need this because of the events/asynchronous behavior below.
        var container = $(this.element);
        try {
            this.options.operationTimes_DRAFT = JSON.parse(JSON.stringify(this.options.operationTimes)); // This is used to tell if the Apply button should be enabled or not.

            var stateClasses = [this.options.checkedColorClass, this.options.uncheckedColorClass];
            var subContainer = container.append($(this.options.containerTmpl));
            var $this = this;

            var html = '';


            html += '<style>';
            html += '.clean {';
            html += '    clear: both;';
            html += '}';
            html += '';
            html += '.dayContainer {';
            html += '    float: left;';
            html += '    line-height: 20px;';
            html += '    margin-right: 8px;';
            html += '    width: 65px;';
            html += '    font-size: 11px;';
            html += '    font-weight: bold;';
            html += '}';
            html += '';
            html += '.colorBox {';
            html += '    cursor: pointer;';
            html += '    height: 45px;';
            html += '    border: 2px solid #888;';
            html += '    -webkit-border-radius: 4px;';
            html += '    -moz-border-radius: 4px;';
            html += '    border-radius: 4px;';
            html += '}';
            html += '';
            html += '.colorBox.WorkingDayState {';
            html += '    border: 2px solid #4E8059;';
            //html += '    background-color: #8ade8f;'; 
            html += '    background-color: #BFDCAE;';
            html += '}';
            html += '';
            html += '.colorBox.RestDayState {';
            html += '    border: 2px solid #7a1c44;';
            //html += '    background-color: #de5962;';
            html += '    background-color: aliceblue;';
            html += '}';
            html += '';
            html += '.operationTime .mini-time {';
            html += '    width: 40px;';
            html += '    padding: 3px;';
            html += '    font-size: 12px;';
            html += '    font-weight: normal;';
            html += '}';
            html += '';
            html += '.dayContainer .add-on {';
            html += '    padding: 4px 2px;';
            html += '}';
            html += '';
            html += '.colorBoxLabel {';
            html += '    clear: both;';
            html += '    font-size: 12px;';
            html += '    font-weight: bold;';
            html += '}';
            html += '';
            html += ' .invisible {';
            html += '    visibility: hidden;';
            html += '}';
            html += '';
            html += '.operationTime {';
            html += '    margin-top: 5px;';
            html += '}';
            html += '</style>';



            //html += '<table>';
            //html += '    <tr>';
            //html += '        <td>';
            //html += '            <label for="hours-configuration-selection">';
            //html += '                <span data-localize="Configuration">Configuration</span>';
            //html += '            </label> :';
            //html += '        </td>';
            //html += '        <td>';
            //html += '            <div class="input">';
            //html += '                <select name="hours-configure" id="hours-configuration-selection" onchange="$(\'.bwOperationalHours\').bwOperationalHours(\'configurationDropDown_OnChange\');">';
            //html += '                    <option value="Global" selected>Global</option>';
            //html += '                    <option value="Workstation" label="Workstation">Workstation</option>';
            //html += '                </select>';
            //html += '            </div>';
            //html += '        </td>';
            //html += '    </tr>';
            //html += '    <tr>';
            //html += '       <td>';
            //html += '           <label for="hours-workstation-selection">';
            //html += '               <span data-localize="Workstation">Workstation </span>';
            //html += '           </label>:';
            //html += '       </td>';
            //html += '       <td>';
            //html += '           <div class="input">';
            //html += '               <select name="hours-workstation" id="hours-workstation-selection" >';
            //html += '                   <option value="" selected="selected"></option>';
            //html += '               </select>';
            //html += '           </div>';
            //html += '       </td>';
            //html += '    </tr>';
            //html += '</table>';
            this.element.html(html);

            for (var i = 0; i < this.options.operationTimes.length; i++) {
                subContainer.append(this.options.dayTmpl);
            }

            for (var i = 0; i < this.options.operationTimes.length; i++) {
                var day = thiz.options.operationTimes[i];

                // Put the text under the day colored square green or red. eg: Mon  [] all day
                var html = '';
                var operationDayNode = container.find(".dayContainer").eq(i);
                html += day.Weekday + '  ' + '<div id="checkboxSecuraOperationalHours_AllDay_' + day.Weekday + '" style="font-weight:normal;font-size:8px;float:right;"><input type="checkbox" /><div style="display:inline;vertical-align:middle;">all day</div></div>';
                operationDayNode.find('.weekday').html(html);

                var isWorkingDay = day.IsActive; //$this.getValueOrDefault(day.IsActive, thiz.options.defaultActive);
                operationDayNode.find('.operationState').prop('checked', isWorkingDay);

                var timeFrom = day.TimeFrom; //$this.getValueOrDefault(day.timeFrom, thiz.options.defaultOperationTimeFrom);
                operationDayNode.find('[name="startTime"]').val(timeFrom);

                var endTime = day.TimeTill; //$this.getValueOrDefault(day.timeTill, thiz.options.defaultOperationTimeTill);
                operationDayNode.find('[name="endTime"]').val(endTime);
            }

            container.find(".operationState").change(function () {
                var checkbox = $(this);
                var boxClass = thiz.options.checkedColorClass;
                var timeControlDisabled = false;

                var weekday = checkbox.parents(".dayContainer").find(".weekday")[0].innerHTML.split(' ')[0]; // eg: 'Mon'

                if (!checkbox.prop("checked")) {
                    // disabled
                    boxClass = thiz.options.uncheckedColorClass;
                    timeControlDisabled = true;
                    var element = document.getElementById('checkboxSecuraOperationalHours_AllDay_' + weekday);
                    if (element) {
                        element.style.display = 'none';
                    }
                }

                for (var i = 0; i < thiz.options.operationTimes.length; i++) {
                    if (thiz.options.operationTimes[i].Weekday == weekday) {
                        // Keep the json in sync with the display.
                        thiz.options.operationTimes[i].IsActive = !timeControlDisabled;
                        thiz.checkIfWeShouldEnableTheApplyButton();
                    }
                }

                checkbox.parents(".colorBox").removeClass(stateClasses.join(' ')).addClass(boxClass);
                checkbox.parents(".dayContainer").find(".operationTime").toggle(!timeControlDisabled);

            }).trigger("change");

            container.find(".colorBox").on("click", function () {
                var checkbox = $(this).find(".operationState");
                checkbox.prop("checked", !checkbox.prop('checked')).trigger("change");
            });

            // At this point the whole thing is rendered, so hook up the time picker text boxes.
            $('.operationTimeFrom, .operationTimeTill').timepicker({
                'timeFormat': 'H:mm',
                'step': 15
            });

            container.find(".operationTimeFrom").change(function () {
                var weekday = $(this).parents(".dayContainer").find(".weekday")[0].innerHTML; // eg: 'Mon'
                var time = $(this).val();
                //console.log('operationTimeFrom weekday: ' + weekday + ', time: ' + time);
                for (var i = 0; i < thiz.options.operationTimes.length; i++) {
                    if (thiz.options.operationTimes[i].Weekday == weekday) {
                        // Keep the json in sync with the display.
                        thiz.options.operationTimes[i].TimeFrom = time;
                        thiz.checkIfWeShouldEnableTheApplyButton();
                    }
                }
            });

            container.find(".operationTimeTill").change(function () {
                var weekday = $(this).parents(".dayContainer").find(".weekday")[0].innerHTML; // eg: 'Mon'
                var time = $(this).val();
                //console.log('operationTimeTill weekday: ' + weekday + ', time: ' + time);
                for (var i = 0; i < thiz.options.operationTimes.length; i++) {
                    if (thiz.options.operationTimes[i].Weekday == weekday) {
                        // Keep the json in sync with the display.
                        thiz.options.operationTimes[i].TimeTill = time;
                        thiz.checkIfWeShouldEnableTheApplyButton();
                    }
                }
            });

            this.loadAndDisplayOperationalHours();


            console.log('In bwOperationalHours._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwOperationalHours</span>';
            html += '<br />';
            html += '<span style="">Exception in bwOperationalHours.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwOperationalHours")
            .text("");
    },
    getValueOrDefault: function (val, defaultVal) {
        return (jQuery.type(val) === "undefined" || val == null) ? defaultVal : val;
    },
    saveSelectedOperationalHours: function () {
        try {
            console.log('In saveSelectedOperationalHours().');

            debugger;
            this.useOperationHoursFeature();

            var opSelection = $('#hours-configuration-selection').find('option:selected').text();


            if (opSelection == 'Global') {

                //openOperationHoursSaveDialog();
                var dialogMessage = 'To save the selected global operation hours settings, click Confirm.';
                var confirmButtonText = 'Confirm';
                var cancelButtonText = 'Cancel';
                localize('[rel*=localize]', ["Messages"], locale, function (localizedStrings) {
                    try { // codemarker 4-10-2021
                        if (localizedStrings["SURE"]) {
                            dialogTitle = localizedStrings["SURE"];
                        }
                        if (localizedStrings["CONFIRM"] && localizedStrings["CANCEL"]) {
                            confirmButtonText = localizedStrings["CONFIRM"];
                            cancelButtonText = localizedStrings["CANCEL"];
                        }
                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                });
                localize('[rel*=localize]', ["Admin"], locale, function (localizedStrings) {
                    try { // codemarker 4-10-2021
                        if (localizedStrings["Save-operation-hours-Confirm"]) {
                            dialogMessage = localizedStrings["Save-operation-hours-Confirm"];
                        }
                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                });

                $('#oh-global-save-dialog').dialog(
                    {
                        modal: true,
                        width: 450,
                        resizable: false,
                        closeOnEscape: false,
                        title: dialogTitle,
                        open: function () {
                            try { // codemarker 4-10-2021
                                $('#liveText-polite').html(dialogTitle + dialogMessage);
                            } catch (e) {
                                console.log('Exception in xx(): ' + e.stack);
                            }
                        },
                        buttons: [{
                            text: confirmButtonText,
                            click: function () {
                                try { // codemarker 4-10-2021
                                    saveOperationHours();
                                    $(this).dialog("close");
                                } catch (e) {
                                    console.log('Exception in xx(): ' + e.stack);
                                }
                            }
                        }, {
                            text: cancelButtonText,
                            click: function () {
                                try { // codemarker 4-10-2021
                                    $(this).dialog("close");
                                } catch (e) {
                                    console.log('Exception in xx(): ' + e.stack);
                                }
                            }
                        }]
                    }).text(dialogMessage);

            } else {

                //saveOperationHours();



                var opSelection = $('#hours-configuration-selection').find('option:selected').text();
                var selection = "";
                var idx = $("#hoursAccordion").accordion("option", "active");
                var sUrl = "";

                var hId = $("#hoursAccordion input[type=hidden][class=HiddenId]")[idx];
                var hIdx = $(hId).val();

                var desc = $("#description-" + hIdx).val();
                if (opSelection == 'Global') {

                    selection = hIdx;//$("#panelNum-"+idx).val();

                    sURL = "updateGlobalOperationHours/update";

                } else {
                    selection = $('#hours-workstation-selection').find('option:selected').text();

                    sURL = "updateWorkstationOperationHours/update";


                }

                var days = "";
                if ($('#mon-' + hIdx).prop("checked")) {

                    days = days.concat("Monday,");
                }
                if ($('#tues-' + hIdx).is(':checked')) {

                    days = days.concat("Tuesday,");
                }
                if ($('#wed-' + hIdx).is(':checked')) {

                    days = days.concat("Wednesday,");
                }
                if ($('#thurs-' + hIdx).is(':checked')) {

                    days = days.concat("Thursday,");
                }
                if ($('#fri-' + hIdx).is(':checked')) {

                    days = days.concat("Friday,");
                }
                if ($('#sat-' + hIdx).is(':checked')) {

                    days = days.concat("Saturday,");
                }
                if ($('#sun-' + hIdx).is(':checked')) {

                    days = days.concat("Sunday");

                }

                var valid = validateOperationHoursForm();

                if (valid) {
                    $.ajax({
                        type: 'POST',
                        url: 'rest/' + sURL,
                        data: {

                            wrId: selection,
                            startDay: $("#start_date").val(),
                            endDay: $("#end_date").val(),
                            days: days,
                            startTime: $("#start_time-" + hIdx + " option:selected").text(),
                            endTime: $("#end_time-" + hIdx + " option:selected").text(),
                            description: $("#description-" + hIdx).val(),
                            size: $('#hoursAccordion h3').size(),
                            idx: hIdx
                        },
                        success: function (result) {
                            try { // codemarker 4-10-2021
                                data = result;
                                loadAccordionGlobal();
                            } catch (e) {
                                console.log('Exception in xx(): ' + e.stack);
                            }
                        },
                        complete: function () {
                            try { // codemarker 4-10-2021
                                $.each(data, function (index, text) {
                                    try { // codemarker 4-10-2021
                                        $('#description').append($('#description').val(text).html(text));


                                        $("#hoursAccordion").accordion({ collapsible: false, autoHeight: false });
                                    } catch (e) {
                                        console.log('Exception in xx(): ' + e.stack);
                                    }
                                });
                            } catch (e) {
                                console.log('Exception in xx(): ' + e.stack);
                            }

                        }

                    });

                }






            }

            //alert('Selected json operationTime: ' + JSON.stringify(this.options.operationTimes));
        } catch (e) {
            console.log('Exception in saveSelectedOperationalHours(): ' + e.stack);
        }
    },
    checkIfWeShouldEnableTheApplyButton: function () {
        try {
            //console.log('In checkIfWeShouldEnableTheApplyButton().');
            if (JSON.stringify(this.options.operationTimes_DRAFT) != JSON.stringify(this.options.operationTimes)) {
                $('#operational-hours-save').prop("disabled", false).removeClass("ui-state-disabled"); // This enables the button.
            } else {
                $('#operational-hours-save').prop("disabled", true).addClass("ui-state-disabled"); // This disables the button.
            }
        } catch (e) {
            console.log('Exception in checkIfWeShouldEnableTheApplyButton(): ' + e.stack);
        }
    },
    configurationDropDown_OnChange: function () {

        // $("#hours-configuration-selection").on('change', function () {
        try { // codemarker 4-10-2021
            //var thiz = this;
            //loadWorkstations();
            var text = $('#hours-configuration-selection').find('option:selected').text();
            //var wrSelection = $('#hours-workstation-selection').find('option:selected').text();

            if (text == 'Workstation' && workstationsListEmpty == false) {
                $('#tableWorkstationSelection').show();
                this.loadWorkstationsDropdown();
                //loadAccordionGlobal();

            } else if (text == 'Global') {
                $('#tableWorkstationSelection').hide();

                //loadAccordionGlobal();

            } //else if (text == 'Workstation' && workstationsListEmpty == true) {

            //    $('#hoursAccordion').hide();
            //    $('#sDate').hide();
            //    $('#eDate').hide();
            //    //$('#hours-save-button').hide();
            //    $("#operational-hours-save").css('display', 'none');
            //    //$('#hours-delete-button').hide();
            //    $("#operational-hours-delete").css('display', 'none');
            //}
        } catch (e) {
            console.log('Exception in xx(): ' + e.stack);
        }

        //});

    },
    useOperationHoursFeature: function () {
        try { // codemarker 4-10-2021
            // load all credential types into an map(value,key)
            return $.ajax({
                type: 'GET',
                url: 'rest/properties/useOperationHoursFeature',
                cache: false,
                dataType: 'json',
                success: function (result) {
                    try { // codemarker 4-10-2021

                        console.log('In bwOperationalHours.useOperationHoursFeature.GET.rest/properties/useOperationHoursFeature.success(). result: ' + result);

                        if (result == false) {
                            $('#tabs-4-link').hide();
                        }
                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    try { // codemarker 4-10-2021
                        console.log('Error in bwOperationalHours.useOperationHoursFeature.GET.rest/properties/useOperationHoursFeature(): ' + JSON.stringify(jqXHR) + ', ' + JSON.stringify(textStatus) + ', ' + JSON.stringify(errorThrown));
                        showAjaxError(jqXHR, textStatus, errorThrown,
                            getEnrollMessageTarget());
                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                }
            });
        } catch (e) {
            console.log('Exception in xx(): ' + e.stack);
        }
    },
    loadWorkstationsDropdown: function () {
        try { // codemarker 4-10-2021
            console.log('In bwOperationalHours.loadWorkstationsDropdown().');
            return $.ajax({
                type: 'GET',
                url: 'rest/licensedWorkstationRegistrations',
                cache: false,
                dataType: 'json',
                success: function (result) {
                    try { // codemarker 4-10-2021
                        workstationsListEmpty = false;
                        if (result.length != 0) {
                            $("#hours-workstation-selection").empty();
                            $.each(result, function (index, text) {

                                $('#hours-workstation-selection').append(
                                    $('<option></option>').val(text.workstationName).html(text.workstationName)
                                );
                            });
                        } else {
                            workstationsListEmpty = true;
                            $('#workstationSelection').hide();
                            if ($('#hours-configuration-selection').find('option:selected').text() == 'Workstation') {
                                //$('#hours-add-button').hide();
                                $("#operational-hours-add").css('display', 'none');
                            }
                            showError("There are no licensed workstations.", $("#hours-global-msg"), 1000);
                        }
                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    try { // codemarker 4-10-2021
                        console.log('Error in bwOperationalHours.js.loadWorkstationsDropdown.GET.rest/licensedWorkstationRegistrations(): ' + JSON.stringify(jqXHR) + ', ' + JSON.stringify(textStatus) + ', ' + JSON.stringify(errorThrown));
                        showError("There are no licensed workstations.", $("#hours-global-msg"), 1000);
                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                }
            });
        } catch (e) {
            console.log('Exception in xx(): ' + e.stack);
        }
    },
    createOperationHoursSettings: function (idxt) {
        try { // codemarker 4-10-2021
            var opSelection = $('#hours-configuration-selection').find('option:selected').text();
            var selection = "";
            var idx = $("#hoursAccordion").accordion("option", "active");
            var sUrl = "";
            if (opSelection == 'Global') {

                selection = idxt;

                sURL = "createGlobalOperationHours/create";

            } else {
                selection = $('#hours-workstation-selection').find('option:selected').text();

                sURL = "createWorkstationOperationHours/create";


            }


            $.ajax({
                type: 'GET',
                url: 'rest/' + sURL,
                data: {
                    selection: selection,
                    startDate: $("#start_date").val(),
                    endDate: $("#end_date").val(),
                    idx: idxt
                },
                success: function (result) {
                    try { // codemarker 4-10-2021
                        data = result;

                        //if (idx=='undefined'){
                        loadAccordionGlobal();
                        //}
                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                },
                complete: function () {
                    try { // codemarker 4-10-2021
                        $.each(data, function (index, text) {
                            try { // codemarker 4-10-2021
                                $('#description').append($('#description').val(text).html(text));


                                $("#hoursAccordion").accordion({ collapsible: false, autoHeight: false });
                            } catch (e) {
                                console.log('Exception in xx(): ' + e.stack);
                            }
                        });

                    } catch (e) {
                        console.log('Exception in xx(): ' + e.stack);
                    }
                }

            });

        } catch (e) {
            console.log('Exception in xx(): ' + e.stack);
        }
    },




    loadAndDisplayOperationalHours: function () {
        try { // codemarker 4-10-2021
            //ShowActivitySpinner();
            //console.log('In bwOperationalHours.js.loadAndDisplayOperationalHours().');
            //var opSelection = $('#hours-configuration-selection').find('option:selected').text();
            //var selection = "";

            //var sUrl = "";
            ////debugger;
            //if (opSelection == 'Global') {

            //    selection = 'global';

            //    sURL = "globalOperationHoursSettings/";

            //} else {
            //    var workstationId = $('#hours-workstation-selection').find('option:selected').text();

            //    sURL = "workstationAllOperationHours" + encodeURIComponent(workstationId); // + '/'; //workstationRegistration/{wrId}


            //}


            //$.ajax({
            //    type: 'GET',
            //    url: 'rest/' + sURL,
            //    cache: false,
            //    dataType: 'json',
            //    success: function (data) {
            //        try { // codemarker 4-10-2021
            //            HideActivitySpinner();
            //            console.log('In bwOperationalHours.js.GET.rest/.success(). data: ' + JSON.stringify(data));
            //            //debugger;
            //            for (var i = 0; i < data.length; i++) {
            //                if (data[i].days) {
            //                    for (var j = 0; j < data[i].days.length; j++) {

            //                    }
            //                }
            //            }

                       
            //        } catch (e) {
            //            console.log('Exception in xx(): ' + e.stack);
            //        }
            //    },
            //    complete: function (data) {
            //        try { // codemarker 4-10-2021
            //            HideActivitySpinner();
            //            console.log('In bwOperationalHours.js.GET.rest/.complete(). data: ' + JSON.stringify(data));
            //            $.each(data, function (index, text) {

            //                // $('#description').append($('#description').val(text).html(text));


            //                //$("#hoursAccordion").accordion({collapsible: false, autoHeight: false });

            //            });
            //            $("#hoursAccordion").focus();
            //        } catch (e) {
            //            console.log('Exception in xx(): ' + e.stack);
            //        }
            //    },
            //    error: function (jqXHR, textStatus, errorThrown) {
            //        try { // codemarker 4-10-2021
            //            HideActivitySpinner();
            //            console.log('Error in bwOperationalHours.js.GET.rest/(): ' + JSON.stringify(jqXHR) + ', ' + JSON.stringify(textStatus) + ', ' + JSON.stringify(errorThrown));

            //        } catch (e) {
            //            console.log('Exception in xx(): ' + e.stack);
            //        }
            //    }
            //});

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in xx(): ' + e.stack);
        }
    }




});