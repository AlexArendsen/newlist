function DashCtrl($scope, ItemService, RootItem) {
  var vm = this

  // == Data
  vm.items = []
  vm.tabs = []
  vm.citem;      // Currently selected item
  vm.ctab;       // Currently selected tab

  // == Methods
  vm.initialize = initialize
  vm.getDump = getDump
  vm.initializeTabs = initializeTabs
  vm.isChildOfCurrent = isChildOfCurrent
  vm.selectChild = selectChild
  vm.selectTab = selectTab
  vm.selectItem = selectItem
  vm.addTab = addTab
  vm.removeTab = removeTab
  vm.touchItem = touchItem
  vm.goBack = goBack
  vm.addItem = addItem
  vm.saveItems = saveItems

  function initialize() {
    vm.getDump()
    vm.initializeTabs()
  }

  function getDump() {
    vm.items = []
    ItemService.dump(function(items){ vm.items = items })
  }

  function initializeTabs() {
    vm.tabs = []
    vm.addTab()
  }

  function isChildOfCurrent(item) {
    return item.parent == vm.citem.id
  }

  function selectChild(item) {
    item.parent_object = vm.citem
    vm.selectItem(item)
  }

  function selectTab(tab) {
    vm.ctab = tab
    vm.selectItem(tab.item)
  }

  function selectItem(item) {
    vm.ctab.item = vm.citem = item
  }

  function addTab() {
    vm.selectTab(vm.tabs[vm.tabs.push({item:RootItem})-1])
  }

  function removeTab() {
    vm.tabs.splice(tabs.indexof(tab),1)
  }

  function touchItem(i) {
    i.changed = true
  }

  function goBack() {
    if(par = vm.citem.parent_object) {
      vm.selectItem(par)
    } else {
      alert("There was an error!")
    }
  }

  // Tell ItemService to add a new item
  function addItem() {
    ItemService.add(
      vm.newItemTitle,
      vm.citem.id,
      function(item) {vm.items.push(item) }
    )
    vm.newItemTitle = ""
  }

  // Round up changed items and tell ItemService to commit them to the server
  function saveItems() {
    changed = $.map(vm.items, function(e){return e.changed&&e})
    if(changed.length) {
      console.log("Saving "+changed.length+" items...")
      ItemService.save(
        changed,
        function() {
          $.each(vm.items,function(idx){vm.items[idx].changed=false})
          console.log("Saved!")
        }
      )
    } else { console.log("Didn't have to save anything...") }
  }

  vm.initialize()
}


DashCtrl.$inject = ["$scope", "ItemService", "RootItem"]

app.controller('DashController', DashCtrl)
