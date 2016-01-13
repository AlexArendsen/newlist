app.factory("HTTPService", ['$rootScope', '$http', 'ErrorService', function($rootScope, $http, ErrorService){
  return {
    post: function(url, data, callback, error) {
      return $.ajax({  // Using jQuery because PHP can't handle the truth (aka, JSON)
        url: url,
        data: data,
        type: "POST",
        success: function(res){
          try { callback(JSON.parse(res)); $rootScope.$apply() }
          catch(e) { ErrorService.error(res) }
        },
        error: ErrorService.error
      })
    }
  }
}])
