(function() {
  'use strict';

  angular
    .module('newlist')
    .directive('nlwarning', function() {
      return {
        restrict: "E",
        transclude: true,
        templateUrl: "templates/warning.html"
      };
    })
})()
