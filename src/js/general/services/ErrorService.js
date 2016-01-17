(function() {
  'use strict';

  angular
    .module('newlist')
    .factory('ErrorService', ErrorService)

  function ErrorService($mdToast) {
    return {
      error: function(message) {
        console.trace()
        console.log(message)
        $mdToast.show($mdToast.simple().textContent(message||"(Error without message provided)"))
      }
    }
  }

  ErrorService.$inject = ["$mdToast"]
})();
