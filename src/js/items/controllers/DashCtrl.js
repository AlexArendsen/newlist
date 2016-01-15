app.controller("DashController", ["$scope", "ItemService", function($scope, ItemService){

  // Get items from server
  $scope.items = []
  ItemService.dump(function(items){ $scope.items = items })

  // Set up views
  $scope.tabs = [null]  // Default tab shows top-level items
  $scope.currentTab = 0;
  $scope.currentItem = function(v,i,a){ return (!(titem=$scope.tabs[$scope.currentTab]))?v.parent==null:v.parent==titem.id }

  $scope.selectItem = function(item) {
    item.parent_object = $scope.tabs[$scope.currentTab]
    $scope.tabs[$scope.currentTab] = item
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


