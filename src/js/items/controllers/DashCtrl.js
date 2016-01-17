(function() {
  'use strict';

  angular
    .module('newlist')
    .controller('DashController', DashController)

  function DashController($mdDialog, ItemService, RootItem) {
    var vm = this

    // == Data
    vm.tree = {}
    vm.tabs = []
    vm.cnode;  // Currently selected node
    vm.ctab;   // Currently selected tab

    // == Methods
    vm.initialize = initialize
    vm.getDump = getDump
    vm.initializeTabs = initializeTabs
    vm.initializeTree = initializeTree
    vm.tally = tally
    vm.itemProgress = itemProgress
    vm.itemPicker = itemPicker
    vm.selectTab = selectTab
    vm.selectItem = selectItem
    vm.addTab = addTab
    vm.removeTab = removeTab
    vm.checkItem = checkItem
    vm.goBack = goBack
    vm.addItem = addItem
    vm.saveItems = saveItems

    function initialize() {
      vm.getDump()
    }

    function getDump() {
      ItemService.dump(function(items){
        vm.initializeTree(items)
        vm.tally(vm.tree[null])
        vm.initializeTabs()
      })
    }

    function initializeTabs() {
      vm.tabs = []
      vm.addTab()
    }

    function initializeTree(items) {
      vm.tree = {}
      var treeget = function(id, insert) {
        if(!vm.tree[id]) {
          if(id==null) { return vm.tree[null] = {item: RootItem, children: []} }
          else if(insert) { return vm.tree[id] = {item: insert, children: []} }
          else { return vm.tree[id] = {item: undefined, children: []} }
        } else {
          if(insert) { return vm.tree[id].item = insert }
          else { return vm.tree[id] }
        }
      };

      items.forEach(function(item) {
        var ipentry = treeget(item.parent, undefined)  // Get or initialize item parent entry
        if(ipentry) {  
          ipentry.children.push(item)  // Add self to children of parent
          treeget(item.id, item)       // Register self as a parent
        } else {
          console.error("Warning, no node returned for item parent "+item.parent)
        }
      })
    }

    function tally(node) {
      if(!node || !node.item || !node.children){ return [0,0] }
      node.item.childrenTotal = 0
      node.item.childrenCompleted = 0
      node.children.forEach(function(child){
        ++node.item.childrenTotal
        var res = vm.tally(vm.tree[child.id])
        node.item.childrenTotal += res[0]

        // For completed children, consider all of their children also completed
        if(child.complete) {
          node.item.childrenCompleted += res[0] + 1
        } else {
          node.item.childrenCompleted += res[1]
        }
      })
      return [node.item.childrenTotal, node.item.childrenCompleted]
    }

    function itemProgress(item) {
      return (!item)?0:parseInt((item.complete)
        ? 100
        :( 100*item.childrenCompleted / (item.childrenTotal || 1) ))
    }

    function selectTab(tab) {
      vm.ctab = tab
      vm.selectItem(tab.item)
    }

    function selectItem(item) {
      vm.cnode = vm.tree[(vm.ctab.item = item).id]
    }

    function addTab() {
      vm.selectTab(vm.tabs[vm.tabs.push({item:RootItem})-1])
    }

    function removeTab() {
      vm.tabs.splice(tabs.indexof(tab),1)
    }

    function checkItem(i) {
      i.changed = true
      vm.tally(vm.tree[null])
    }

    function goBack() {
      vm.selectItem(vm.tree[vm.cnode.item.parent].item)
    }

    function itemPicker(ev, callback) {
      vm.mnode = vm.cnode
      $mdDialog.show({
        targetEvent: ev,
        templateUrl: "templates/itemPicker.html"
      })
        .then(
          function(answer){
            if(answer=="confirm") {
              callback(vm.mnode.item)
            }
          },
          function(){}
        )
    }

    // Tell ItemService to add a new item
    function addItem() {
      var citemid = vm.cnode.item.id
      ItemService.add(
        vm.newItemTitle,
        citemid,
        function(item) {
          item.childrenTotal = item.childrenCompleted = 0
          vm.tree[citemid].children.push(item)
          vm.tally(vm.tree[null])
          vm.tree[item.id] = {item: item, children: []}
        }
      )
      vm.newItemTitle = ""
    }

    // Round up changed items and tell ItemService to commit them to the server
    function saveItems(ev) {
      //var changed = $.map(vm.items, function(e){return e.changed&&e})
      //if(changed.length) {
      //  console.log("Saving "+changed.length+" items...")
      //  ItemService.save(
      //    changed,
      //    function() {
      //      $.each(vm.items, function(idx){vm.items[idx].changed=false})
      //      console.log("Saved!")
      //    }
      //  )
      //} else { console.log("Didn't have to save anything...") }
    }

    vm.initialize()
  }

  DashController.$inject = ["$mdDialog", "ItemService", "RootItem"]

})();
