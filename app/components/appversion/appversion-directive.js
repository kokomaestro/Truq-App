'use strict';

/* Directives */


angular.module('Truq')

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm) {
      elm.text(version);
    };
  }]);
