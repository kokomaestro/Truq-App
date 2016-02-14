(function(angular) {
  "use strict";

  var app = angular.module('home', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute']);

  app.controller('HomeCtrl', ['$scope', 'fbutil', 'user', '$firebaseObject', 'FBURL', function ($scope, fbutil, user, $firebaseObject, FBURL) {
      var homeCtrl = this;
    homeCtrl.syncedValue = $firebaseObject(fbutil.ref('syncedValue'));
    homeCtrl.user = user;
    homeCtrl.FBURL = FBURL;

  }]).config(['$stateProvider', function ($stateProvider) {
      $stateProvider.state('truq.home', {
              url: '/',
              views: {
                  //target the ui-view named 'categories' in ROOT state (eggly)
                  'content@': {
                      controller: 'HomeCtrl as homeCtrl',
                      templateUrl: 'home/home.html'
                  },
                  //target the ui-view named 'bookmarks' in ROOT state (eggly)
                  //to show all bookmarks for all categories
                  'nav@': {
                      controller: 'NavbarCtrl as navbarCtrl',
                      templateUrl: 'navbar/navbar.tmpl.html'
                  }
              }
          });
  }]);

})(angular);

