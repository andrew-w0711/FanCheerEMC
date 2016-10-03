'use strict';

angular.module('fancheerEMC').factory('userInfo', ['$resource',
    function ($resource) {
        return $resource('api/accounts/cuser');
    }
]);

angular.module('fancheerEMC').factory('userLoaderService', ['userInfo', '$q',
    function (userInfo, $q) {
        var load = function() {
            var delay = $q.defer();
            userInfo.get({},
                function(theUserInfo) {
                    delay.resolve(theUserInfo);
                },
                function() {
                    delay.reject('Unable to fetch user info');
                }
            );
            return delay.promise;
        };
        return {
            load: load
        };
    }
]);

angular.module('fancheerEMC').factory('userInfoService', ['$cookieStore', 'userLoaderService',
    function($cookieStore, userLoaderService) {
        var currentUser = null;
         var    customer = false,
            admin = false,
            id = null,
            username = '';

        //console.log("USER ID=", $cookieStore.get('userID'));

        var loadFromCookie = function() {
            //console.log("UserID=", $cookieStore.get('userID'));

            id = $cookieStore.get('userID');
            username = $cookieStore.get('username');
            customer = $cookieStore.get('customer');
             admin = $cookieStore.get('admin');
        };

        var saveToCookie = function() {
            $cookieStore.put('accountID', id);
            $cookieStore.put('username', username);
            $cookieStore.put('customer', customer);
              $cookieStore.put('admin', admin);
        };

        var clearCookie = function() {
            $cookieStore.remove('accountID');
            $cookieStore.remove('username');
            $cookieStore.remove('customer');
             $cookieStore.remove('admin');
            $cookieStore.remove('hthd');
        };

        var saveHthd = function(header) {
            $cookieStore.put('hthd', header);
        };

        var getHthd = function(header) {
            return $cookieStore.get('hthd');
        };

        var hasCookieInfo =  function() {
            if ( $cookieStore.get('username') === '' ) {
                return false;
            }
            else {
                return true;
            }
        };

        var getAccountID = function() {
            if (isAuthenticated() && currentUser.accountId) {
                return currentUser.accountId.toString();
            }
            return '0';
        };

        var isAdmin = function() {
            return admin;
        };

        var isCustomer = function() {
            return customer;
        };

        var isAuthenticated = function() {
            if (currentUser!=null && currentUser && angular.isObject(currentUser)) {
                return true;
            }
            else {
                return false;
            }
        };

        var loadFromServer = function() {
            if ( !isAuthenticated() ) {
                userLoaderService.load().then(setCurrentUser);
            }
        };

        var setCurrentUser = function(newUser) {
            currentUser = newUser;
            //console.log("NewUser=", newUser);
            if ( currentUser != null && angular.isObject(currentUser) ) {
                username = currentUser.username;
                id = currentUser.accountId;
                if ( angular.isArray(currentUser.authorities)) {
                    angular.forEach(currentUser.authorities, function(value, key){
                        switch(value.authority)
                        {
                            case 'user':
                                //console.log("user found");
                                break;
                            case 'admin':
                                admin = true;
                                //console.log("admin found");
                                break;
                            case 'customer':
                                customer = true;
                                //console.log("customer found");
                                break;
                            default:
                            //console.log("default");
                        }
                    });
                }
                //saveToCookie();
            }
            else {
                 customer = false;
                admin = false;
                  //clearCookie();
            }
        };

        var getUsername = function() {
            return username;
        };

        return {
            saveHthd: saveHthd,
            getHthd: getHthd,
            hasCookieInfo: hasCookieInfo,
            loadFromCookie: loadFromCookie,
            getAccountID: getAccountID,
            isAdmin: isAdmin,
             isCustomer: isCustomer,
            isAuthenticated: isAuthenticated,
             setCurrentUser: setCurrentUser,
            loadFromServer: loadFromServer,
            getUsername: getUsername
        };
    }
]);
