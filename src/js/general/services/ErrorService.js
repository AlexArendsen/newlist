app.factory("ErrorService", ["$mdToast", function($mdToast){
  return {
    error: function(message) {
      $mdToast.show($mdToast.simple().textContent(message||"(Error without message provided)"))
    }
  }
}])
