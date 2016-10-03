'use strict';

angular.module('fancheerEMC').controller('MainCtrl', ['$scope', '$rootScope', 'i18n', '$location', 'userInfoService', '$modal','$filter','base64','$http','Idle','$q',
    function ($scope, $rootScope, i18n, $location, userInfoService, $modal,$filter,base64,$http,Idle,$q) {
        //This line fetches the info from the server if the user is currently logged in.
        //If success, the app is updated according to the role.

//        userInfoService.loadFromServer();

        $scope.selectPromoTab = function (value){
        };

        $scope.getPromosOnDate = function (date, venueCode) {
            var delay = $q.defer();
            $http.get(apiUrl('GetPromotionsOnDateService'), {
                params: {
                    venueCode:venueCode,
                    date:date
                 }
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('GetPromotionsOnDateService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get GetPromotionsOnDateService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };


        $scope.getPromosBetweenDates = function (start,end, venueCode) {
            var delay = $q.defer();
            $http.get(apiUrl('GetPromotionsBetweenDateService'), {
                params: {
                    venueCode:venueCode,
                    start:start,
                    end:end
                }
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){
//                        //console.log("promotions are empty");
                    }
                    $rootScope.debug('GetPromotionsBetweenDateService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
//                        //console.log("promotions are resolved");
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get GetPromotionsBetweenDateService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };


        $scope.getGamesBetween = function (start, end) {
            var delay = $q.defer();
            $http.get(apiUrl('GetGamesBetweenDatesService'), {
                params: {
                    start:start,
                    end:end
                 }
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('Polled GetGamesBetweenDatesService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get GetGamesBetweenDatesService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };


        $scope.getGamesOnDate = function (date) {
            var delay = $q.defer();
            $http.get(apiUrl('GetGamesOnDateService'), {
                params: {
                    date:date
                 }
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('Polled GetGamesOnDateService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get GetGamesOnDateService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };





        //This line fetches the info from the server if the user is currently logged in.
        //If success, the app is updated according to the role.
//        userInfoService.loadFromServer();

        $scope.language = function () {
            return i18n.language;
        };

        $scope.setLanguage = function (lang) {
            i18n.setLanguage(lang);
        };

        $scope.activeWhen = function (value) {
            return value ? 'active' : '';
        };

        $scope.activeIfInList = function(value, pathsList) {
            var found = false;
            if ( angular.isArray(pathsList) === false ) {
                return '';
            }
            var i = 0;
            while ( (i < pathsList.length) && (found === false)) {
                if ( pathsList[i] === value ) {
                    return 'active';
                }
                i++;
            }
            return '';
        };

        $scope.path = function () {
            return $location.url();
        };

        $scope.login = function () {
//        //console.log("in login");
            $scope.$emit('event:loginRequest', $scope.username, $scope.password);
        };

        $scope.loginReq = function () {
//        //console.log("in loginReq");
            if ($rootScope.loginMessage()){
                $rootScope.loginMessage().text="";
                $rootScope.loginMessage().show=false;
            }
            $scope.$emit('event:loginRequired');
        };

        $scope.logout = function () {
            userInfoService.setCurrentUser(null);
            $scope.username = $scope.password = null;
            $scope.$emit('event:logoutRequest');
            $location.url('/console');
        };

        $scope.cancel = function () {
            $scope.$emit('event:loginCancel');
        };

        $scope.isAuthenticated = function() {
            return userInfoService.isAuthenticated();
        };

        $scope.isCustomer = function() {
            return userInfoService.isCustomer();
        };

        $scope.isAdmin = function() {
            return userInfoService.isAdmin();
        };

        $scope.getRoleAsString = function() {
            if ( $scope.isCustomer() === true ) { return 'customer'; }
             if ( $scope.isAdmin() === true ) { return 'Admin'; }
            return 'undefined';
        };

        $scope.getUsername = function() {
            if ( userInfoService.isAuthenticated() === true ) {
                return userInfoService.getUsername();
            }
            return '';
        };

        $scope.getAccountID = function() {
                 return userInfoService.getAccountID();
         };

        $rootScope.showLoginDialog = function(username, password) {
            $rootScope.username = username;
            $rootScope.password = password;
            $location.path('/login');
        };

        $rootScope.started = false;

        Idle.watch();

        $rootScope.$on('IdleStart', function() {
            closeModals();
            $rootScope.warning = $modal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        $rootScope.$on('IdleEnd', function() {
            closeModals();
        });

        $rootScope.$on('IdleTimeout', function() {
            closeModals();
            if( $scope.isAuthenticated) {
                $scope.logout();
            }
            $rootScope.timedout = $modal.open({
                templateUrl: 'timedout-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        function closeModals() {
            if ($rootScope.warning) {
                $rootScope.warning.close();
                $rootScope.warning = null;
            }

            if ($rootScope.timedout) {
                $rootScope.timedout.close();
                $rootScope.timedout = null;
            }
        };

        $rootScope.start = function() {
            closeModals();
            Idle.watch();
            $rootScope.started = true;
        };

        $rootScope.stop = function() {
            closeModals();
            Idle.unwatch();
            $rootScope.started = false;

        };


        $scope.checkForIE = function() {
            var BrowserDetect = {
                init: function () {
                    this.browser = this.searchString(this.dataBrowser) || 'An unknown browser';
                    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'an unknown version';
                    this.OS = this.searchString(this.dataOS) || 'an unknown OS';
                },
                searchString: function (data) {
                    for (var i=0;i<data.length;i++) {
                        var dataString = data[i].string;
                        var dataProp = data[i].prop;
                        this.versionSearchString = data[i].versionSearch || data[i].identity;
                        if (dataString) {
                            if (dataString.indexOf(data[i].subString) !== -1) {
                                return data[i].identity;
                            }
                        }
                        else if (dataProp) {
                            return data[i].identity;
                        }
                    }
                },
                searchVersion: function (dataString) {
                    var index = dataString.indexOf(this.versionSearchString);
                    if (index === -1) { return; }
                    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
                },
                dataBrowser: [
                    {
                        string: navigator.userAgent,
                        subString: 'Chrome',
                        identity: 'Chrome'
                    },
                    {   string: navigator.userAgent,
                        subString: 'OmniWeb',
                        versionSearch: 'OmniWeb/',
                        identity: 'OmniWeb'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'Apple',
                        identity: 'Safari',
                        versionSearch: 'Version'
                    },
                    {
                        prop: window.opera,
                        identity: 'Opera',
                        versionSearch: 'Version'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'iCab',
                        identity: 'iCab'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'KDE',
                        identity: 'Konqueror'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'Firefox',
                        identity: 'Firefox'
                    },
                    {
                        string: navigator.vendor,
                        subString: 'Camino',
                        identity: 'Camino'
                    },
                    {       // for newer Netscapes (6+)
                        string: navigator.userAgent,
                        subString: 'Netscape',
                        identity: 'Netscape'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'MSIE',
                        identity: 'Explorer',
                        versionSearch: 'MSIE'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'Gecko',
                        identity: 'Mozilla',
                        versionSearch: 'rv'
                    },
                    {       // for older Netscapes (4-)
                        string: navigator.userAgent,
                        subString: 'Mozilla',
                        identity: 'Netscape',
                        versionSearch: 'Mozilla'
                    }
                ],
                dataOS : [
                    {
                        string: navigator.platform,
                        subString: 'Win',
                        identity: 'Windows'
                    },
                    {
                        string: navigator.platform,
                        subString: 'Mac',
                        identity: 'Mac'
                    },
                    {
                        string: navigator.userAgent,
                        subString: 'iPhone',
                        identity: 'iPhone/iPod'
                    },
                    {
                        string: navigator.platform,
                        subString: 'Linux',
                        identity: 'Linux'
                    }
                ]

            };
            BrowserDetect.init();

            if ( BrowserDetect.browser === 'Explorer' ) {
                var title = 'You are using Internet Explorer';
                var msg = 'This site is not yet optimized with Internet Explorer. For the best user experience, please use Chrome, Firefox or Safari. Thank you for your patience.';
                var btns = [{result:'ok', label: 'OK', cssClass: 'btn'}];

                //$dialog.messageBox(title, msg, btns).open();



            }
        };





        $rootScope.$watch(function () {
            return $location.path();
        }, function (newLocation, oldLocation) {
            $rootScope.setActive(newLocation);
        });

        $rootScope.api = function (value) {
            return  value;
        };


        $rootScope.isActive = function (path) {
            return path === $rootScope.activePath;
        };

        $rootScope.setActive = function (path) {
            if (path === '' || path === '/') {
                $location.path('/home');
            } else {
                $rootScope.activePath = path;
            }
        };


        $scope.getPromoTriggers = function () {
            var delay = $q.defer();
            $http.get(apiUrl('GetPromotionTriggersService'), {
                params: {
                }
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('Polled GetPromotionTriggersService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get GetPromotionTriggersService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };

        $scope.postPromo = function (promo) {
            var delay = $q.defer();
            $http.post(apiUrl('PostPromotionService'), promo,{}).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('Polled PostPromotionService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to PostPromotionService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };


//        $scope.getGamesScheduleService = function (sport) {
//            var delay = $q.defer();
//            $http.get(apiUrl('GetGamesScheduleService'), {
//                params: {
//                    sport: sport
//                }
//            }).then(
//                function (response) {
//                    var data = angular.fromJson(response.data);
//                    $rootScope.debug('Polled GetGamesScheduleService');
//                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
//                        delay.reject(data['errorMessage']);
//                    } else {
//                        delay.resolve(data);
//                    }
//                },
//                function (error) {
//                    $rootScope.debug('Failed to get GetGamesBySportService:' + error);
//                    delay.reject(error.data);
//                }
//            );
//            return delay.promise;
//        };

        $scope.deletePromo = function (id) {
            var delay = $q.defer();
            $http.get(apiUrl('DeletePromotionService'),{params:{promoId:id}}).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('Polled DeletePromotionService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to DeletePromotionService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };

        $scope.getSports = function () {
            var delay = $q.defer();
            $http.get(apiUrl('GetSportsService')).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('Polled GetSportsService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get GetSportsService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };

        $scope.saveController = function (controllerAssignment) {
            var delay = $q.defer();
            $http.get(apiUrl('PostControllerAssignmentsService'), {
                params:  controllerAssignment
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){
                    }
                    $rootScope.debug('PostControllerAssignmentsService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get PostControllerAssignmentsService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };


        $scope.savePromo = function (promo) {
            var delay = $q.defer();
            $http.get(apiUrl('PostPromotionService'), {
                params:  promo
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){
                    }
                    $rootScope.debug('PostPromotionService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get PostPromotionService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };



        $scope.getControllers = function (venue) {
            var delay = $q.defer();
            $http.get(apiUrl('GetControllersService'), {
                params: {
                    venueCode: venue
                }
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('GetControllersService');
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get GetControllersService:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };


        $scope.getTodaysGames = function () {
            var delay = $q.defer();
            $http.get(apiUrl('TodaysGamesService'), {
                params: {
                    date: date
                }
            }).then(
                function (response) {
                    var data = {};
                    try {
                        data = angular.fromJson(response.data);
                    }catch(e){

                    }
                    $rootScope.debug('Polled TodaysGame for date ' + date);
                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
                        delay.reject(data['errorMessage']);
                    } else {
                        delay.resolve(data);
                    }
                },
                function (error) {
                    $rootScope.debug('Failed to get TodaysGame:' + error);
                    delay.reject(error.data);
                }
            );
            return delay.promise;
        };


//        $scope.getSportGames = function (sport) {
//            var delay = $q.defer();
//            $http.get(apiUrl('GetSportGamesService'), {
//                params: {
//                    sport: sport
//                }
//            }).then(
//                function (response) {
//                    var data = angular.fromJson(response.data);
//                    $rootScope.debug('Polled GetSportGamesService');
//                    if (data['errorMessage'] !== undefined && data['errorMessage'] !== "" && data['errorMessage'] !== null) {
//                        delay.reject(data['errorMessage']);
//                    } else {
//                        delay.resolve(data);
//                    }
//                },
//                function (error) {
//                    $rootScope.debug('Failed to get GetSportGamesService:' + error);
//                    delay.reject(error.data);
//                }
//            );
//            return delay.promise;
//        };

    }]);

angular.module('fancheerEMC').controller('LoginCtrl', ['$scope', '$rootScope', function($scope,$rootScope) {
    $scope.user = {username: $rootScope.username, password: $rootScope.password};

    $scope.cancel = function() {
//        $modalInstance.dismiss('cancel');
    };

    $scope.login = function() {
        $scope.$emit('event:loginRequest', $scope.user.username,$scope.user.password);
    };

    $scope.register = function(){
        $scope.$emit('event:registerRequest');

    }
}]);


