'use strict';
/**
 * Created by Harold Affo on 5/11/15.
 */
/**
 * @ngdoc function
 * @name fanCheerEmcApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the fanCheerEmcApp
 */
angular.module('fancheerEMC')
  .controller('EMCCtrl', function ($scope) {
        $scope.active = '/promo_console';
        $scope.loading = false;
        $scope.isActive = function (path) {
            return path === $scope.active;
        };
        $scope.setActive = function (path) {
            $scope.active = path;
            $scope.loading = false;
        };
  });
