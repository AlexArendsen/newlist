app.factory("ErrorService", [function(){
  return {
    error: function(message) {
      Materialize.toast("<i class='material-icons'>warning</i> <span class='error-text'>"+message+"</span>", 4000)
    }
  }
}])
