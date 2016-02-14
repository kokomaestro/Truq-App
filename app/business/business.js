"use strict";
angular.module('business', [])


    .controller('BusinessCtrl', [ 'user',
        function(user) {
            var business = this;
            business.user = user;

        }]).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('truq.business.create', {
            url: '/createBusiness',
            templateUrl: 'app/business/business.tmpl.html',
            controller: 'BusinessCtrl as businessCtrl',
            resolve: {
                user: ['Auth', function (Auth) {
                    return Auth.$waitForAuth();
                }]
            }
        });
    }]);