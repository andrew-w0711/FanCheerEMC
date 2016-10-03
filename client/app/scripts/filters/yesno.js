'use strict';

angular.module('fancheerEMC').filter('yesno', [ function () {
    return function (input) {
        return input ? 'YES' : 'NO';
    };
}]);