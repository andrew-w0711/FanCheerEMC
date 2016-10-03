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
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
