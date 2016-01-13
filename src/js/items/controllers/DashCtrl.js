app.controller("DashController", ["$scope", "ItemService", function($scope, ItemService){
  $scope.items = []
  ItemService.dump(function(items){
    $scope.items = items
  })

  $scope.sid = null       // Selected item ID number, isolated for efficiency
  $scope.selected = null  // Selected item object
  $scope.currentItem = function(v,i,a){ return v.parent==$scope.sid }

  $scope.selectItem = function(item) {
    item.parent_object = $scope.selected
    $scope.selected = item
    $scope.sid = item.id
  }

  $scope.goBack = function() {
    par = $scope.selected.parent_object
    if (par === undefined) {
      // TODO -- If parent not memoized, track them down
      alert("There was a data problem. This will eventually get fixed, but for now, please reload the page.")
      return 1
    }

    $scope.selected = par
    $scope.sid = par?par.id:null
  }

  $scope.addItem = function() {
    ItemService.add(
      $scope.newItemTitle,
      $scope.sid,
      function(item) {$scope.items.push(item)}
    )
    $scope.newItemTitle = ""
  }

}])


