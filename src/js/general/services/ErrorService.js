(function() {
  'use strict';

  angular
    .module('newlist')
    .factory('ErrorService', ErrorService)

  function ErrorService() {
    return {
      error: function(message) {
        $mdToast.show($mdToast.simple().textContent(message||"(Error without message provided)"))
      }
    }
  }

  ErrorService.$inject = ["$mdToast"]
})()
