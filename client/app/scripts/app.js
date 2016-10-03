'use strict';

/**
 * @ngdoc overview
 * @name fanCheerEmcApp
 * @description
 * # fanCheerEmcApp
 *
 * Main module of the application.
 */

var app = angular
    .module('fancheerEMC', [
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngIdle',
        'ui.bootstrap',
        'chart.js',
        'nvd3',
        'mwl.calendar',
        'blueimp.fileupload'
//        ,
//        'ngMockE2E'
    ]);


var
//the HTTP headers to be used by all requests
    httpHeaders,

//the message to show on the login popup page
    loginMessage,

//the spinner used to show when we are still waiting for a server answer
    spinner,

//The list of messages we don't want to displat
    mToHide = ['usernameNotFound', 'emailNotFound', 'usernameFound', 'emailFound', 'loginSuccess', 'userAdded'];

//the message to be shown to the user
var msg = {};


var
    environment = 2,
    endpointMap = {
        'GetControllersService': 'GetControllersService/webresources/GetControllersService',
        'GetGamesBetweenDatesService': 'GetGamesBetweenDatesService/webresources/GetGamesBetweenDatesService',
        'GetPromotionTriggersService': 'GetPromotionTriggersService/webresources/GetPromotionTriggersService',
        'PostPromotionService': 'PostPromotionService/webresources/PostPromotionService',
        'DeletePromotionService': 'DeletePromotionService/webresources/DeletePromotionService',
        'PostControllerAssignmentsService': 'PostControllerAssignmentsService/webresources/PostControllerAssignmentsService',
        'GetSportsService': 'GetSportsService/webresources/GetSportsService',
        'GetGamesOnDateService': 'GetGamesOnDateService/webresources/GetGamesOnDateService',
        'GetPromotionsOnDateService': 'GetPromotionsOnDateService/webresources/GetPromotionsOnDateService',
        'GetPromotionsBetweenDateService': 'GetPromotionsBetweenDateService/webresources/GetPromotionsBetweenDateService',
        'VersionService': 'VersionService/webresources/VersionService'
    },
    apiRoot = ["/", "http://localhost:8080/FanCheerServiceREST/", "http://services.fancheerinteractive.com:8080/", "http://development.fancheerinteractive.com:8080/"];


var apiUrl = function (key) {
    return apiRoot[environment] + endpoint(key);
};

var endpoint = function (key) {
    return endpointMap[key];
};


app.config(function ($routeProvider, $httpProvider, KeepaliveProvider, IdleProvider,calendarConfigProvider) {


//    $httpProvider.defaults.useXDomain = true;
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];

//    calendarConfigProvider.setDateFormats({
//        hour: 'HH:mm' //this will configure the hour view to display in 24 hour format rather than the default of 12 hour
//    });
//
//    calendarConfigProvider.setTitleFormats({
//        day: 'ddd D MMM' //this will configure the day view title to be shorter
//    });
//
//    calendarConfigProvider.setI18nStrings({
//        eventsLabel: 'Events', //This will set the events label on the day view
//        timeLabel: 'Time' //This will set the time label on the time view
//    });

    $routeProvider
        .when('/', {
            templateUrl: 'views/console/console.html'
        })
        .when('/console', {
            templateUrl: 'views/console/console.html'
        })
        .when('/about', {
            templateUrl: 'views/about.html'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html'
        })
        .when('/forgotten', {
            templateUrl: 'views/account/forgotten.html',
            controller: 'ForgottenCtrl'
        })
        .when('/issue', {
            templateUrl: 'views/issue.html',
            controller: 'IssueCtrl'
        })
        .when('/registration', {
            templateUrl: 'views/account/registration.html',
            controller: 'RegistrationCtrl'
        })
        .when('/account', {
            templateUrl: 'views/account/account.html',
            controller: 'AccountCtrl',
            resolve: {
                login: ['LoginService', function (LoginService) {
                    return LoginService();
                }]
            }
        })
        .when('/resetPassword', {
            templateUrl: 'views/account/registerResetPassword.html',
            controller: 'RegisterResetPasswordCtrl',
            resolve: {
                isFirstSetup: function () {
                    return false;
                }
            }
        })
        .when('/registrationSubmitted', {
            templateUrl: 'views/account/registrationSubmitted.html'
        })
        .when('/login', {
            templateUrl: 'views/account/login.html'
            //            resolve: {
//                user: function () {
//                    return {username: null, password: null};
//                }
//            }
        })
        .otherwise({
            redirectTo: '/'
        });



    $httpProvider.interceptors.push(function ($rootScope, $q) {
        var setMessage = function (response) {
            //if the response has a text and a type property, it is a message to be shown
            if (response.data && response.data.text && response.data.type) {
                if (response.status === 401) {
//                        //console.log("setting login message");
                    loginMessage = {
                        text: response.data.text,
                        type: response.data.type,
                        show: true,
                        manualHandle: response.data.manualHandle
                    };

                } else if (response.status === 503) {
                    msg = {
                        text: "server.down",
                        type: "danger",
                        show: true,
                        manualHandle: true
                    };
                } else {
                    msg = {
                        text: response.data.text,
                        type: response.data.type,
                        show: true,
                        manualHandle: response.data.manualHandle
                    };
                    var found = false;
                    var i = 0;
                    while (i < mToHide.length && !found) {
                        if (msg.text === mToHide[i]) {
                            found = true;
                        }
                        i++;
                    }
                    if (found === true) {
                        msg.show = false;
                    } else {
//                        //hide the msg in 5 seconds
//                                                setTimeout(
//                                                    function() {
//                                                        msg.show = false;
//                                                        //tell angular to refresh
//                                                        $rootScope.$apply();
//                                                    },
//                                                    10000
//                                                );
                    }
                }
            }
        };

        return {
            response: function (response) {
                setMessage(response);
                return response || $q.when(response);
            },

            responseError: function (response) {
                setMessage(response);
                return $q.reject(response);
            }
        };

    });

    //configure $http to show a login dialog whenever a 401 unauthorized response arrives
    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response.status === 401) {
                    //We catch everything but this one. So public users are not bothered
                    //with a login windows when browsing home.
                    if (response.config.url !== 'api/accounts/cuser') {
                        //We don't intercept this request
                        var deferred = $q.defer(),
                            req = {
                                config: response.config,
                                deferred: deferred
                            };
                        $rootScope.requests401.push(req);
                        $rootScope.$broadcast('event:loginRequired');
//                        return deferred.promise;

                        return  $q.when(response);
                    }
                }
                return $q.reject(response);
            }
        };
    });


    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response.status === 401) {
                    //We catch everything but this one. So public users are not bothered
                    //with a login windows when browsing home.
                    if (response.config.url !== 'api/accounts/cuser') {
                        //We don't intercept this request
                        var deferred = $q.defer(),
                            req = {
                                config: response.config,
                                deferred: deferred
                            };
                        $rootScope.requests401.push(req);
                        $rootScope.$broadcast('event:loginRequired');
                        return  $q.when(response);
                    }
                } else if (response.status === 503) {

                }
                return $q.reject(response);
            }
        };
    });


    //intercepts ALL angular ajax http calls
    $httpProvider.interceptors.push(function ($q) {
        return {
            response: function (response) {
                //hide the spinner
                spinner = false;
                return response || $q.when(response);
            },
            responseError: function (response) {
                //hide the spinner
                spinner = false;
                return $q.reject(response);
            }
        };


    });


//    $httpProvider.interceptors.push(function ($q) {
//        return {
//            request: function (config) {
//                $httpProvider.defaults.useXDomain = true;
//                delete $httpProvider.defaults.headers.common['X-Requested-With'];
//                return config || $q.when(config);
//            }
//        }
//    });



    IdleProvider.idle(30 * 60);
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(10);


    var spinnerStarter = function (data, headersGetter) {
        spinner = true;
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerStarter);

    httpHeaders = $httpProvider.defaults.headers;


});


app.run(function ($rootScope, $location, $filter, $http, base64, userInfoService, $q) {

    //Check if the login dialog is already displayed.
    $rootScope.loginDialogShown = false;
    $rootScope.serverUp = false;
    $rootScope.username = null;
    $rootScope.password = null;

    $rootScope.apiUrl = function (url) {
        return apiUrl(url);
    };

    $rootScope.debug = function (log) {
        ////console.log(log);
    };


    //make current message accessible to root scope and therefore all scopes
    $rootScope.msg = function () {
        return msg;
    };

    //make current loginMessage accessible to root scope and therefore all scopes
    $rootScope.loginMessage = function () {
//            //console.log("calling loginMessage()");
        return loginMessage;
    };

    //showSpinner can be referenced from the view
    $rootScope.showSpinner = function () {
        return spinner;
    };

    /**
     * Holds all the requests which failed due to 401 response.
     */
    $rootScope.requests401 = [];

    $rootScope.$on('event:loginRequired', function () {
//            //console.log("in loginRequired event");
        $rootScope.showLoginDialog();
    });

    /**
     * On 'event:loginConfirmed', resend all the 401 requests.
     */
    $rootScope.$on('event:loginConfirmed', function () {
        var i,
            requests = $rootScope.requests401,
            retry = function (req) {
                $http(req.config).then(function (response) {
                    req.deferred.resolve(response);
                });
            };

        for (i = 0; i < requests.length; i += 1) {
            retry(requests[i]);
        }
        $rootScope.requests401 = [];

        $location.url('/console');
    });

    /*jshint sub: true */
    /**
     * On 'event:loginRequest' send credentials to the server.
     */
    $rootScope.$on('event:loginRequest', function (event, username, password) {
        httpHeaders.common['Accept'] = 'application/json';
        httpHeaders.common['Authorization'] = 'Basic ' + base64.encode(username + ':' + password);
//        httpHeaders.common['withCredentials']=true;
//        httpHeaders.common['Origin']="http://localhost:9000";
        $http.get('api/accounts/login').success(function () {
            //If we are here in this callback, login was successfull
            //Let's get user info now
            httpHeaders.common['Authorization'] = null;
            $http.get('api/accounts/cuser').success(function (data) {
                userInfoService.setCurrentUser(data);
                $rootScope.$broadcast('event:loginConfirmed');
            });
        });
    });


    $rootScope.$on('event:registerRequest', function (event) {
        $location.url('/registration');
    });

    /**
     * On 'logoutRequest' invoke logout on the server.
     */
    $rootScope.$on('event:logoutRequest', function () {
        httpHeaders.common['Authorization'] = null;
        userInfoService.setCurrentUser(null);
        $http.get('j_spring_security_logout');
    });

    /**
     * On 'loginCancel' clears the Authentication header
     */
    $rootScope.$on('event:loginCancel', function () {
        httpHeaders.common['Authorization'] = null;
    });

    $rootScope.$on('$routeChangeStart', function (next, current) {
//            //console.log('route changing');
        // If there is a message while change Route the stop showing the message
        if (msg && msg.manualHandle === 'false') {
//                //console.log('detected msg with text: ' + msg.text);
            msg.show = false;
        }
    });

    $rootScope.loadUserFromCookie = function () {
        if (userInfoService.hasCookieInfo() === true) {
            ////console.log("found cookie!")
            userInfoService.loadFromCookie();
            httpHeaders.common['Authorization'] = userInfoService.getHthd();
        }
        else {
            ////console.log("cookie not found");
        }
    };

    $rootScope.checkServer = function (date, venueCode) {
        var delay = $q.defer();
        $http.get(apiUrl('VersionService')).then(
            function (response) {
                $rootScope.serverUp = true;
            },
            function (error) {
                msg = {
                    text: "server.down",
                    type: "danger",
                    show: true,
                    manualHandle: true
                };
                $rootScope.serverUp = false;
            }
        );
        return delay.promise;
    };


    $rootScope.checkServer();


});





