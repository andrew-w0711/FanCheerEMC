'use strict';

/* "newcap": false */

angular.module('fancheerEMC')
.controller('AccountCtrl', ['$scope', '$resource', 'AccountLoader', 'Account', 'userInfoService', '$location','PasswordChange','$http',
    function ($scope, $resource, AccountLoader, Account, userInfoService, $location,PasswordChange,$http) {

        $scope.accountpwd = {};

        $scope.initModel = function(data) {
            $scope.account = data;
            $scope.accountOrig = angular.copy($scope.account);
        };

        $scope.updateAccount = function() {
            //not sure it is very clean...
            //TODO: Add call back?
            new Account($scope.account).$save();

            $scope.accountOrig = angular.copy($scope.account);
        };

        $scope.resetForm = function() {
            $scope.account = angular.copy($scope.accountOrig);
        };

        //TODO: Change that: formData is only supported on modern browsers
        $scope.isUnchanged = function(formData) {
            return angular.equals(formData, $scope.accountOrig);
        };

        $scope.changePassword = function() {
            var changes = angular.fromJson({
                "username":$scope.account.username,
                "password":$scope.accountpwd.currentPassword,
                    "newPassword": $scope.accountpwd.newPassword,
                "id":$scope.account.id
            });

            new PasswordChange(changes).$save();

        };

        $scope.deleteAccount = function () {
            var tmpAcct = new Account();
            tmpAcct.id = $scope.account.id;

            tmpAcct.$remove(function() {
                //console.log("Account removed");
                //TODO: Add a real check?
                userInfoService.setCurrentUser(null);
                $scope.$emit('event:logoutRequest');
                $location.url('/console');
            });
        };

        /*jshint newcap:false */
        AccountLoader(userInfoService.getAccountID()).then(
            function(data) {
                $scope.initModel(data);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            },
            function() {
//                console.log('Error fetching account information');
            }
        );
    }
]);
