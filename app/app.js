'use strict';

// Declare app level module which depends on filters, and services
angular.module('Truq', [
    'ui.router',
    'config',
    'home',
    'account',
    'login',
    'business',
    'ui.bootstrap',
    'ngAnimate',
    'navbar'

  ]).run(['$rootScope', 'Auth', '$state', 'loginRedirectPath', function($rootScope, Auth, $state, loginRedirectPath) {
    // track status of authentication
    // some of our routes may reject resolve promises with the special {authRequired: true} error
    // this redirects to the login page whenever that is encountered

    Auth.$onAuth(check);

    function check(user) {
        if (!user && $state.current.authRequired===true) {
            console.log('check failed', user, $state.$current.name); //debug
            $state.go(loginRedirectPath);
        }
        else {
            console.log($state.$current.name);
        }
        $rootScope.loggedIn = !!user;
    }
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        if (error == "AUTH_REQUIRED") {
            $state.go(loginRedirectPath);
        }
    });

}]).config(['$stateProvider','$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('truq', {
        url : '',
        abstract: true,
        resolve: {
            user: ['Auth', function (Auth) {
                return Auth.$waitForAuth();
            }],
            cart: ['fbutil', 'user', function(fbutil, user){
                return fbutil.ref('businesses', user.uid);
            }]
        }
    });
    $urlRouterProvider.otherwise('/');
}]);
