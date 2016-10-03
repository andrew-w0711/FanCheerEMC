///**
// * Created by haffo on 5/19/15.
// */
//angular.module('fancheerEMC')
//    .controller('DashboardCtrl', ['$scope', '$modal', '$q', 'uiCalendarConfig', '$http', '$rootScope', '$compile', function ($scope, $modal, $q, uiCalendarConfig, $http, $rootScope, $compile) {
//
//
//        $scope.init = function () {
//            /**
//             * On 'event:loginConfirmed', resend all the 401 requests.
//             */
//            $scope.$on('event:loginConfirmed', function (event) {
//                $rootScope.$broadcast('event:loadConsole');
//                event.stopPropagation();
//            });
//
//
//
//        };
//
//
//}]);


angular.module('fancheerEMC')
    .controller('ConsoleCtrl', ['$scope', '$modal', '$q', '$http', '$rootScope', '$compile', 'AccountLoader', 'userInfoService', function ($scope, $modal, $q, $http, $rootScope, $compile, AccountLoader, userInfoService) {

        $scope.gamesError = null;
        $scope.msg = {};
        $scope.promo = null;
        $scope.promoCopy = null;
        $scope.promoTriggers = [];
        $scope.promos = [];
        $scope.sports = [];
        $scope.calendarEvents = [];
//        $scope.eventSources = [$scope.calendarEvents];
        $scope.calendarLoading = false;
        $scope.calendarError = null;
        $scope.promosLoading = false;
        $scope.sportsLoading = false;
        $scope.sportsError = null;
        $scope.promoEvents = [];
//        $scope.view = null;
        $scope.dayElement = null;
        $scope.dayGames = [];
        $scope.controllerAssignmentLoading = false;
        $scope.account = null;
        $scope.loadingSportGames = false;
        $scope.controllers = [];
        $scope.controllersCopy = [];
        $scope.controllerAssignments = [];
        $scope.controllerId = null;
        $scope.tmpControllers = [].concat($scope.controllers);
        $scope.todayGames = {};
        $scope.sportsGames = {};
        $scope.controllerAssignmentError = null;
        $scope.promoError = {
            text: "",
            type: "",
            show: false
        };
        $scope.format = "yyyy-MM-dd";
        $scope.hstep = 1;
        $scope.mstep = 15;
        $scope.isStartDateMeridian = true;
        $scope.isEndDateMeridian = true;
        $scope.startDateOpened = false;
        $scope.endDateOpened = false;
        $scope.saving = false;
        var t = new Date();
        $scope.todayDate =new Date();
        $scope.savingControllerAssignments = false;

//        $scope.timeZone = moment().format('zz');

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.uploadOptions = {
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            previewSourceFileTypes: '/^image\/(gif|jpeg|png)$/',
            paramName: 'file',
            formAcceptCharset: 'utf-8',
            autoUpload: true,
            type: 'POST'
        };

        $scope.file = null;
        $scope.data = null;
        $scope.changeTo = 'Hungarian';
        $scope.tmpPromos = [];

        $scope.currentView = null;
        $scope.calendarView = 'month';
        $scope.calendarDay = new Date();
        $scope.calendarTitle = 'Promotions Calendar';
        $scope.currentEvent = null;
        $scope.calendarStarDate = null;
        $scope.calendarEndDate = null;

        $scope.eventClicked = function (event) {
            $scope.editEvent(event);
        };

        $scope.editEvent = function (event) {
            event.type = 'warning';
            if ($scope.currentEvent != null) {
                $scope.currentEvent.type = 'info';
            }
            $scope.currentEvent = event;
            $scope.editPromo( $scope.eventToPromo(event));
        };


        $scope.editPromo = function (promo) {
            $scope.saving = false;
            // ASK confirmation first
            $scope.promoError = {
                text: "",
                type: "",
                show: false
            };
            $scope.promo = promo;
            $scope.data = null;
            $scope.file = null;
            $scope.getDayGames($scope.calendarDay);
        };



        $scope.eventEdited = function (event) {
            $scope.editEvent(event);
        };


        function daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        function lastDayInWeek(currentDay) {
            return firstDayInWeek(currentDay) + 6;
        }

        function firstDayInWeek(currentDay) {
            return currentDay.getDate() - currentDay.getDay();
        }

        $scope.updateEvents = function () {
            if ($scope.account != null) {
                switch ($scope.calendarView) {
                    case 'year':
                        $scope.calendarStarDate = new Date($scope.calendarDay.getFullYear(), 0, 1);
                        $scope.calendarEndDate = new Date($scope.calendarDay.getFullYear(), 11, 31, 23, 59, 59);
                        break;
                    case 'month':
                        $scope.calendarStarDate = new Date($scope.calendarDay.getFullYear(), $scope.calendarDay.getMonth(), 1);
                        $scope.calendarEndDate = new Date($scope.calendarDay.getFullYear(), $scope.calendarDay.getMonth(), daysInMonth($scope.calendarDay.getMonth(), $scope.calendarDay.getFullYear()), 23, 59, 59);
                        break;
                    case 'week':
                        $scope.calendarStarDate = new Date($scope.calendarDay.getFullYear(), $scope.calendarDay.getMonth(), firstDayInWeek($scope.calendarDay));
                        $scope.calendarEndDate = new Date($scope.calendarDay.getFullYear(), $scope.calendarDay.getMonth(), lastDayInWeek($scope.calendarDay), 23, 59, 59);
                        break;
                    case 'day':
                        $scope.calendarStarDate = new Date($scope.calendarDay.toDateString());
                        $scope.calendarStarDate.setHours(0);
                        $scope.calendarStarDate.setMinutes(0);
                        $scope.calendarStarDate.setSeconds(0);
                        $scope.calendarEndDate = new Date($scope.calendarDay.toDateString());
                        $scope.calendarEndDate.setHours(23);
                        $scope.calendarEndDate.setMinutes(59);
                        $scope.calendarEndDate.setSeconds(59);
                        break;
                }
                $scope.calendarError = null;
                $scope.getPromosBetweenDates($scope.calendarStarDate, $scope.calendarEndDate, $scope.account.venue).then(function (promos) {
                    $scope.setEvents(promos);
                    $scope.getDayGames($scope.calendarDay);
                 }, function (error) {
                    $scope.calendarError = "ERROR: Cannot load the events";
                    $scope.setEvents([]);
                });
            }
        };

        $scope.eventToPromo = function (event) {

             return angular.copy({
                promoId: event.id,
                promoText: event.title,
                imageFileName: event.imageFileName,
                promoStartDate: new Date(event.startsAt),
                promoEndDate:   new Date(event.endsAt),
                promoTrigger: event.promoTrigger,
                promoEvent: event.promoEvent,
                promoDuration: event.promoDuration,
                promoDescription: event.promoDescription
            });
        };

        function parseDate(input) {
            var parts = input.split('-');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            var d = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]); // Note: months are 0-based
            console.log(d);
        }

//        function localizeDateStr(date_to_convert_str) {
//            var date_to_convert = parseDate(date_to_convert_str);
//            var local_date = new Date();
//            date_to_convert.setHours(date_to_convert.getHours() + local_date.getTimezoneOffset​()/60);
//            return date_to_convert.toString();
//        }


        function changeToSlash(date){
            return date.replace(/-/g,'/');
        }

        function getDate(date){
            var d = new Date(changeToSlash(date.substring(0,19))+ " UTC");
            return d;
        }
 


        $scope.promoToEvent = function (promo) {
//            var start = promo.promoStartDate.substring(0,19) + " UTC" ;
//            var end = promo.promoEndDate && promo.promoEndDate != null && promo.promoEndDate !== '' ? promo.promoEndDate.substring(0,19) + " UTC" : start;

            var start = getDate(promo.promoStartDate);
            var end = promo.promoEndDate && promo.promoEndDate != null && promo.promoEndDate !== '' ?  getDate(promo.promoEndDate): start;

            var event =  {
                id: promo.promoId,
                title: promo.promoText,
                promoText: promo.promoText,
                type: 'info',
                imageFileName: promo.imageFileName,
                startsAt: start,
                endsAt: end,
                editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
                deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                draggable: false, //Allow an event to be dragged and dropped
                resizable: false, //Allow an event to be resizable
                incrementsBadgeTotal: true,
                cssClass: 'a-css-class-name',
                promoDescription: promo.promoDescription,
                promoTrigger: promo.promoTrigger,
                promoEvent: promo.promoEvent,
                promoDuration: promo.promoDuration
            };

            //console.log(event);
            return event;
        };

        $scope.getEventTitle = function (event) {
            return event.promoText + ":" + $filter('date')(event.startsAt, 'short') + " - " + $filter('date')(event.endsAt, 'short');
        };


        $scope.update = function (event, promo) {
            event.id = promo.promoId;
            event.title = promo.promoText;
            event.type = 'info';
            event.imageFileName = promo.imageFileName;
            event.startsAt = promo.promoStartDate;
            event.endsAt = promo.promoEndDate;
            event.promoDescription = promo.promoDescription;
            event.promoTrigger = promo.promoTrigger;
            event.promoEvent = promo.promoEvent;
            event.promoDuration = promo.promoDuration;
        };


        $scope.toggle = function ($event, field) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.currentEvent[field] = !$scope.currentEvent[field];
        };


        $scope.load = function () {
            if (userInfoService.getAccountID() != '0') {
                new AccountLoader(userInfoService.getAccountID()).then(
                    function (data) {
                        $scope.account = data;

                        $scope.updateEvents();

                        $scope.getControllers($scope.account.venue).then(function (controllers) {
                            $scope.controllers = controllers;
                            $scope.tmpControllers = [].concat($scope.controllers);
                            $scope.controllersCopy = angular.copy($scope.controllers);
                        }, function (error) {
                            $scope.controllers = [];
                            $scope.tmpControllers = [].concat($scope.controllers);
                            $scope.controllerAssignmentError = error;
                            $scope.controllersCopy = [];
                        });

                    },
                    function () {
                        $scope.controllers = [];
                        $scope.tmpControllers = [].concat($scope.controllers);
                        $scope.controllersCopy = angular.copy($scope.controllers);
                    }
                );
            }
        };

        $scope.$on('event:loginConfirmed', function (e) {
            $scope.load();
        });

        $scope.$on('fileuploadadd', function (e, data) {
            $scope.data = data;
            if (data.autoUpload || (data.autoUpload !== false)) {
                data.process().done(function () {
                    $scope.file = data.files[0];
                });
            }
        });

        $scope.$watch('calendarDay',
            function (calendarDay) {
                $scope.updateEvents();
                var calendarEvents = $scope.calendarEvents;
            }
        );

        $scope.$watch('calendarView',
            function (calendarView) {
                $scope.updateEvents();
                var calendarEvents = $scope.calendarEvents;
            }
        );


        $scope.init = function () {

            $scope.getPromoTriggers().then(function (triggers) {
                $scope.promoTriggers = triggers;
            }, function (error) {
                $scope.promoTriggers = [];
                $scope.error = error;

            });

            $scope.getSports().then(function (sports) {
                $scope.sports = sports;
            }, function (error) {
                $scope.sports = [];
                $scope.error = error;
            });

            $scope.load();
        };


        $scope.findPromo = function (id) {
            for (var i = 0; i < $scope.tmpPromos.length; i++) {
                if ($scope.tmpPromos[i].promoId === id) {
                    return $scope.tmpPromos[i];
                }
            }
            return undefined;
        };

        $scope.getPromoImage = function (promo) {
            return promo != null ? $scope.getImage(promo.imageFileName) : null;
        };

        $scope.getImage = function (fileName) {
            return fileName != null && fileName != "" ? apiRoot[environment] + "uploaded_promos/" + fileName : null;
        };


//        $scope.findEvent = function (id) {
//            for (var i = 0; i < $scope.calendarEvents.length; i++) {
//                if ($scope.calendarEvents[i].id === id) {
//                    return $scope.calendarEvents[i];
//                }
//            }
//            return undefined;
//        };


        $scope.setEvents = function (promos) {
            $scope.calendarEvents.length = 0;
            if (promos.length > 0) {
                for (var i = 0; i < promos.length; i++) {
                    $scope.calendarEvents.push($scope.promoToEvent(promos[i]));
                }
            }
        };

//        $scope.getDayPromos = function (date) {
//            if ($scope.account != null) {
//                $scope.promosLoading = true;
//                $scope.getPromosOnDate(date, $scope.account.venue).then(function (promos) {
//                    $scope.promos = promos;
////                    $scope.setEvents(promos);
//                    $scope.promosLoading = false;
//                }, function (error) {
//                    $scope.promos = [];
////                    $scope.setEvents($scope.promos);
//                    $scope.promosLoading = false;
//                });
//            }
//        };


//        $scope.setCurrentViewEvents = function () {
//            if ($scope.account != null) {
//                $scope.calendarError = null;
////                $scope.setEvents([]);
//                if ($scope.currentView && $scope.currentView != null && $scope.currentView.start && $scope.currentView.start != null && $scope.currentView.end && $scope.currentView.end != null) {
//                    var start = $scope.currentView.start;
//                    var end = $scope.currentView.name === 'agendaDay' ? $scope.currentView.start : $scope.currentView.end;
//                    $scope.getPromosBetweenDates(start, end, $scope.account.venue).then(function (promos) {
//                        $scope.setEvents(promos);
//                    }, function (error) {
//                        $scope.calendarError = "ERROR: Cannot load the calendarEvents";
//                        $scope.setEvents([]);
//                    });
//                }
//            }
//        };

        $scope.getSportGames = function (sportId) {
            var res = [];
            angular.forEach($scope.games, function (obj) {
                if (obj.game.sportId === sportId) {
                    res.push(obj);
                }
            });
            return res;
        };

        $scope.getDayGames = function (date) {
            $scope.gamesLoading = true;
            $scope.gamesError = null;
            $scope.getGamesOnDate(date).then(function (dayGames) {
                // convert game date to local time zone
                for (var i = 0; i < dayGames.length; i++) {
                    var game = dayGames[i].game;
                    game.startTime = getDate(game.startTime);
                }

                $scope.games = dayGames;
                $scope.gamesBySports = {};

                for (var i = 0; i < $scope.sports.length; i++) {
                    $scope.gamesBySports[$scope.sports[i].sportId] = $scope.getSportGames($scope.sports[i].sportId);
                }
                $scope.gamesLoading = false;
            }, function (error) {
                $scope.games = [];
                $scope.gamesError = error;
                $scope.gamesLoading = false;
            });
        };


//        /* alert on Drop */
//        $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
//            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
//        };
//        /* alert on Resize */
//        $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
//            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
//        };
//        /* add and removes an event source of choice */
//        $scope.addRemoveEventSource = function (sources, source) {
//            var canAdd = 0;
//            angular.forEach(sources, function (value, key) {
//                if (sources[key] === source) {
//                    sources.splice(key, 1);
//                    canAdd = 1;
//                }
//            });
//            if (canAdd === 0) {
//                sources.push(source);
//            }
//        };
//        /* add custom event*/
//        $scope.addEvent = function (promo) {
//            $scope.calendarEvents.push(promo);
//        };
//        /* remove event */
//        $scope.remove = function (index) {
//            $scope.calendarEvents.splice(index, 1);
//        };
//
//        /* Render Tooltip */
//        $scope.eventRender = function (event, element, view) {
//            element.attr({'tooltip': event.title,
//                'tooltip-append-to-body': true});
//            $compile(element)($scope);
//
//        };

//        $scope.viewRender = function (view, element) {
//            $scope.currentView = view;
//            $scope.setCurrentViewEvents();
////            if ($scope.currentView && $scope.currentView != null) {
////                $scope.setCurrentViewEvent();
//////                if($scope.currentView.name === 'agendaDay'){
//////                    $scope.getDayGames();
//////                }else{
//////                    $scope.games = [];
//////                    $scope.gamesBySports = {};
//////                }
////            }
//        };

        $scope.fetchEvents = function () {
//            try {
//                $scope.calendarLoading = false;
//                $scope.calendarError = null;
//                if (uiCalendarConfig.calendars.calendar)
//                    uiCalendarConfig.calendars.calendar.fullCalendar('refetchEvents');
//            } catch (e) {
//
//            }
        };


//        $scope.changeLang = function () {
//            if ($scope.changeTo === 'Hungarian') {
//                $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
//                $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
//                $scope.changeTo = 'English';
//            } else {
//                $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//                $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//                $scope.changeTo = 'Hungarian';
//            }
//        };


//        $scope.openStartDate = function ($event) {
//            $event.preventDefault();
//            $event.stopPropagation();
//            $scope.startDateOpened = true;
//        };


//        $scope.openEndDate = function ($event) {
//            $event.preventDefault();
//            $event.stopPropagation();
//            $scope.endDateOpened = true;
//        };

//        $scope.toggleMin = function () {
//            $scope.minDate = $scope.minDate ? null : new Date();
//        };

//        $scope.getDayClass = function (date, mode) {
//            if (mode === 'day') {
//                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
//                for (var i = 0; i < $scope.calendarEvents.length; i++) {
//                    var currentDay = new Date($scope.calendarEvents[i].date).setHours(0, 0, 0, 0);
//
//                    if (dayToCheck === currentDay) {
//                        return $scope.calendarEvents[i].status;
//                    }
//                }
//            }
//            return '';
//        };

//        $scope.toggleStartDateMode = function () {
//            $scope.isStartDateMeridian = !$scope.isStartDateMeridian;
//        };
//        $scope.toggleEndDateMode = function () {
//            $scope.isEndDateMeridian = !$scope.isEndDateMeridian;
//        };
//
//        $scope.startDateChanged = function () {
//            //console.log('Time changed to: ' + $scope.promo.promoStartDate);
//        };
//
//        $scope.endDateChanged = function () {
//            //console.log('Time changed to: ' + $scope.promo.promoEndDate);
//        };

//        $scope.editPromo = function (promo) {
//            $scope.promoError = {};
//            $scope.promo = $scope.copy(promo);
//            $scope.promo.promoStartDate = new Date(promo.promoStartDate.format());
//            $scope.promo.promoEndDate = new Date((promo.promoEndDate || promo.promoEndDate === null || promo.promoEndDate === '' ? promo.promoStartDate : promo.promoEndDate).format());
//            $scope.data = null;
//            $scope.file = null;
//        };


//            $scope.editImage = function (promo) {
//                var modalInstance = $modal.open({
//                    templateUrl: 'EditPromoImageCtrl.html',
//                    controller: 'EditPromoImageCtrl',
//                    windowClass: "app-modal-window",
//                    resolve: {
//                        promo: function () {
//                            return promo;
//                        }
//                    }
//                });
//                modalInstance.result.then(function (promo) {
//                }, function () {
//                });
//            };


        $scope.createPromo = function () {
            var promo =  {
                promoId:null,
                promoText: null,
                imageFileName: null,
                promoStartDate: new Date().toUTCString(),
                promoEndDate: new Date().toUTCString(),
                promoTrigger:null,
                promoEvent: null,
                promoDuration: 600,
                promoDescription: null
            };
            $scope.currentEvent = $scope.promoToEvent(promo);
            $scope.editPromo(promo);
        };

        $scope.deleteCurrentPromo = function() {

            $scope.promoError = {
                text: "",
                type: "",
                show: false,
                manualHandle: true
            };

            $scope.deletePromo($scope.promo.promoId).then(function (response) {
                var index = $scope.calendarEvents.indexOf($scope.currentEvent);
                if(index >= 0) {
                    $scope.calendarEvents.splice(index, 1);
                }
                $scope.promo = null;
                $scope.saving = false;

            }, function (error) {
                 $scope.promoError = {
                    text: "promoDeleteFailed",
                    type: "danger",
                    show: true,
                    manualHandle: true
                };
            });
        };

        $scope.eventDeleted = function(selectedEvent) {
            $scope.deletePromo(selectedEvent.id).then(function (response) {
               var index = $scope.calendarEvents.indexOf(selectedEvent);
                if(index >= 0) {
                    $scope.calendarEvents.splice(index, 1);
                }
            }, function (error) {
                 msg = {
                    text: "promoDeleteFailed",
                    type: "danger",
                    show: true,
                    manualHandle: true
                };
            });

//            var modalInstance = $modal.open({
//                templateUrl: 'ConfirmDeletePromoCtrl.html',
//                controller: 'ConfirmDeletePromoCtrl',
//                backdrop:false,
//                keyboard:false,
//                resolve: {
//                    selectedEvent: function () {
//                        return selectedEvent;
//                    }
//                }
//            });
//            modalInstance.result.then(function (ev) {
//                var index = $scope.calendarEvents.indexOf(ev);
//                if(index >= 0) {
//                    $scope.calendarEvents.splice(index, 1);
//                }
//            }, function (error) {
//
//            });
        };


        $scope.copy = function (promo) {
            return angular.copy(promo);
        };


        $scope.clone = function (promo) {
            var clone = $scope.copy(promo);
            clone.promoId = null;
            $scope.editPromo(clone);
        };

//        // Disable date before today
//        $scope.disabled = function (date, mode) {
//            return date.getYear() < $scope.todayDate.getYear() || date.getMonth() < $scope.todayDate.getMonth() || date.getDay() < $scope.todayDate.getDay();
//        };

        $scope.save = function () {
            if ($scope.data != null) {
                $scope.saving = true;
                $scope.data.url = "api/promo/uploadImage";
                var jqXHR = $scope.data.submit()
                    .success(function (result, textStatus, jqXHR) {
                        $scope.promo.imageFileName = result;
                        $scope.saveCurrentPromo();
                    })
                    .error(function (jqXHR, textStatus, errorThrown) {
//                        //console.log("Failed to upload the message" + errorThrown);
                        $scope.promoError.show = true;
                        $scope.promoError.text = "promoImageSaveFailed";
                        $scope.promoError.type = "danger";
                        $scope.saving = false;
                    });
            } else { //No image provided
                $scope.saveCurrentPromo();
            }
        };

        $scope.saveCurrentPromo = function () {
                $scope.promo.venueCode = $scope.account.venue;
                $scope.savePromo($scope.promo).then(function (promo) {
                if(!$scope.currentEvent.id || $scope.currentEvent.id < 0 ||  $scope.calendarEvents.indexOf($scope.currentEvent) < 0){
                    $scope.calendarEvents.push($scope.currentEvent);
                }
                $scope.update($scope.currentEvent, $scope.promo);
                $scope.promoError.text = "promoSaveSuccess";
                $scope.promoError.type = "success";
                $scope.promoError.show = true;
                $scope.saving = false;
            }, function (error) {
                $scope.promoError.text = error;
                $scope.promoError.type = "danger";
                $scope.promoError.show = true;
                $scope.saving = false;
            });
        };

        $scope.close = function () {
            $scope.currentEvent.type = 'info';
            delete $scope.currentEvent.startOpen;
            delete $scope.currentEvent.endOpen;
            $scope.promo = null;
            $scope.data = null;
            $scope.file = null;
            $scope.promoCopy = null;
        };

        $scope.cancel = function () {
            $scope.close();
            $scope.currentEvent = null;
        };

        $scope.saveControllerAssignments = function () {
            if ($scope.controllerAssignments != null && $scope.controllerAssignments.length > 0) {
                $scope.savingControllerAssignments = true;
                $scope.controllerAssignmentInfo = null;
                var saved = true;
                for (var i = 0; i < $scope.controllerAssignments.length; i++) {
                    $scope.savingControllerAssignments = true;
                    var assignment = $scope.controllerAssignments[i];
                    delete assignment['errorMessage'];
                    delete assignment['message'];
                    $scope.saveController(assignment).then(function (resp) {
                        saved = saved && true;
                        assignment['message'] = resp.message;
                    }, function (error) {
                        assignment['errorMessage'] = error;
                        saved = false;
                    });
                }
                $scope.savingControllerAssignments = false;
                if (saved) {
                    $scope.controllerAssignments = [];
                    $scope.controllerAssignmentInfo = "Controller Saved Successfully!";
                }
            }
        };

//        $scope.resetControllerAssignments = function () {
//            $scope.controllerAssignmentLoading = false;
//            $scope.controllers = angular.copy($scope.controllersCopy);
//            $scope.tmpControllers = [].concat($scope.controllers);
//            $scope.controllerAssignments = [];
//        };

        $scope.findControllerAssignment = function (row) {
            if (!$scope.controllerAssignments || $scope.controllerAssignments.length === 0) {
                $scope.controllerAssignments = [];
            }
            var found = null;
            angular.forEach($scope.controllerAssignments, function (controllerAssignment) {
                if (controllerAssignment.controllerId === row.netvControllerId) {
                    found = controllerAssignment;
                }
            });
            if (found === null) {
                found = {"controllerId": row.netvControllerId, "gameId": row.gameId};
                $scope.controllerAssignments.push(found);
            }
            return found;
        };


        $scope.gameLabel = function (game) {
            return game.homeTeam.shortName + ' vs ' + game.awayTeam.shortName;
        };


        $scope.setSportGames = function (sport) {
            $scope.sportsGames[sport] = $scope.getSportGames(sport);
        };


        $scope.recordGameAssignment = function (controller) {
            var found = $scope.findControllerAssignment(controller);
            found.gameId = controller.gameId;
        };

    }]);


angular.module('fancheerEMC').controller('ConfirmDeletePromoCtrl', function ($scope, $modalInstance, selectedEvent, $q, $http, $rootScope) {
    $scope.selectedEvent = selectedEvent;
    $scope.loading = false;
    $scope.error = null;
    $scope.delete = function () {
        $scope.loading = true;
        $rootScope.deletePromo($scope.selectedEvent.id).then(function (response) {
            $scope.loading = false;
            $modalInstance.close($scope.selectedEvent);
        }, function (error) {
            $scope.loading = false;
            $scope.error = "promoDeleteFailed";
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});


/**
 * Created by Harold Affo on 5/11/15.
 */
/**
 * @ngdoc function
 * @name fancheerEMC.controller:DisplayViewCtrl
 * @description
 * # DisplayViewCtrl
 * Controller of the fancheerEMC
 */
angular.module('fancheerEMC')
    .controller('ChartsCtrl', function ($scope, $interval) {
        $scope.msg = {};
        $scope.genderOptions = {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',d')(d);
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'Gender'
                },
                yAxis: {
                    axisLabel: 'Total Number',
                    axisLabelDistance: 30
                }
            }
        };


        $scope.genderData = [
            {
                key: "Gender",
                values: [
                    {
                        "label": "Female",
                        "value": Math.floor(Math.random() * 500)
                    } ,
                    {
                        "label": "Male",
                        "value": Math.floor(Math.random() * 500)
                    }
                ]
            }
        ];


        $scope.ageOptions = {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',d')(d);
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'Age Range'
                },
                yAxis: {
                    axisLabel: 'Total Number',
                    axisLabelDistance: 30
                }
            }
        };

        $scope.ageData = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label": "[13-17]",
                        "value": Math.floor(Math.random() * 500)
                    } ,
                    {
                        "label": "[18-34]",
                        "value": Math.floor(Math.random() * 500)
                    },
                    {
                        "label": "[35-43]",
                        "value": Math.floor(Math.random() * 500)
                    },
                    {
                        "label": "[44-54]",
                        "value": Math.floor(Math.random() * 500)
                    },
                    {
                        "label": "[55-67]",
                        "value": Math.floor(Math.random() * 500)
                    },
                    {
                        "label": "[67+]",
                        "value": Math.floor(Math.random() * 500)
                    }
                ]
            }
        ];

        $scope.zipCodeOptions = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltipContent: function (key) {
                    return '<h3>' + key + '</h3>';
                },
                transitionDuration: 350,
                xAxis: {
                    axisLabel: 'Last Customer Time',
                    tickFormat: function (d) {
//                        return d3.format('.02f')(d);
                        return  d3.time.format('%x %H:%M:%S')(new Date(d))
                    }
                },
                yAxis: {
                    axisLabel: 'Number of Customers',
                    tickFormat: function (d) {
                        return d3.format('.d')(d);
                    },
                    axisLabelDistance: 30
                }
            }
        };


        $scope.zData = [
            {
                key: "21704",
                value: Math.floor(Math.random() * 1000), time: '1136005200000'
            },
            {
                key: "22907",
                value: Math.floor(Math.random() * 1000), time: '1138683600000'
            },
            {
                key: "19007",
                value: Math.floor(Math.random() * 1000), time: '1341102800000'
            },
            {
                key: "14005",
                value: Math.floor(Math.random() * 1000), time: '1143781200000'
            },
            {
                key: "28201",
                value: Math.floor(Math.random() * 1000), time: '1546369600000'
            },
            {
                key: "15001",
                value: Math.floor(Math.random() * 1000), time: '1851640000000'
            },
            {
                key: "22001",
                value: Math.floor(Math.random() * 1000), time: '1954318400000'
            },
            {
                key: "22003",
                value: Math.floor(Math.random() * 1000), time: '1656996800000'
            },
            {
                key: "22004",
                value: Math.floor(Math.random() * 1000), time: '1154283200000'
            },
            {
                key: "22006",
                value: Math.floor(Math.random() * 1000), time: '1059557200000'
            }
        ];

        $scope.options = {
            chart: {
                type: 'multiChart',
                height: 450,
                margin: {
                    top: 30,
                    right: 60,
                    bottom: 50,
                    left: 70
                },
                color: d3.scale.category10().range(),
                //useInteractiveGuideline: true,
                transitionDuration: 500,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                yAxis1: {
                    tickFormat: function (d) {
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };


        $scope.streams = ["Engagement", "Promos"];
        $scope.zipCodeData = [];
        $scope.data = [];


        /* Random Data Generator (took from nvd3.org) */
        $scope.generateZipData = function (groups, points) {
            var data = [],
//                shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                random = d3.random.normal();

            for (var i = 0; i < $scope.zData.length; i++) {
                var z = $scope.zData[i];

                var d = {key: z.key,
                    values: []};

                d.values.push({
                    x: z.time, y: z.value, size: z.value * 10, shape: 'circle'
                });

                data.push(d);
            }
            return data;
        };

        $scope.refreshAllCharts = function () {
            $interval(function () {
                angular.forEach($scope.ageData[0].values, function (ageRange) {
                    ageRange.value = Math.floor(Math.random() * 500);
                });

                angular.forEach($scope.zipCodeData[0].values, function (zipCode) {
                    zipCode.y = Math.floor(Math.random() * 360);
                });

                angular.forEach($scope.genderData[0].values, function (gender) {
                    gender.value = Math.floor(Math.random() * 500);
                });

            }, 5000);
        };


        $scope.generateEngagementData = function () {
            var testdata = stream_layers(2, 10 + Math.random() * 100, .1).map(function (data, i) {
                return {
                    key: $scope.streams[i],
                    values: data.map(function (a) {
                        a.y = a.y * (i <= 1 ? 1 : 1);
                        return a
                    })
                };
            });

            testdata[0].type = "bar";
            testdata[0].yAxis = 1;
            testdata[1].type = "line";
            testdata[1].yAxis = 1;
//            testdata[2].type = "line"
//            testdata[2].yAxis = 1
//            testdata[3].type = "line"
//            testdata[3].yAxis = 2
//            testdata[4].type = "bar"
//            testdata[4].yAxis = 2
//            testdata[5].type = "bar"
//            testdata[5].yAxis = 2
//            testdata[6].type = "bar"
//            testdata[6].yAxis = 2

            return testdata;
        };

        /* Inspired by Lee Byron's test data generator. */
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }

            return d3.range(n).map(function () {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }


        $scope.init = function () {
            $scope.zipCodeData = $scope.generateZipData(4, 10);
            $scope.data = $scope.generateEngagementData();

            $scope.refreshAllCharts();
        }


    });
