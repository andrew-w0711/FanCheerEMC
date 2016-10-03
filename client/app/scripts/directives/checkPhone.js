'use strict';

angular.module('fancheerEMC').directive('checkPhone', [
    function () {
        return {
            restrict: 'AC',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                 element.on('keyup', function() {
                    ctrl.$setValidity('phone', element.val().length === 10);
                });
            }
        };
    }
]);
