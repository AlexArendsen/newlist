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
    vm.changed = {}
    vm.cnode;  // Currently selected node
    vm.ctab;   // Currently selected tab

    // == Methods
    vm.initialize = initialize
    vm.getDump = getDump
    vm.initializeTabs = initializeTabs
    vm.initializeTree = initializeTree
    vm.tally = tally
    vm.itemProgress = itemProgress
    vm.isShowable = isShowable
    // vm.itemPicker = itemPicker
    vm.selectTab = selectTab
    vm.selectItem = selectItem
    vm.addTab = addTab
    vm.removeTab = removeTab
    vm.checkItem = checkItem
    vm.goBack = goBack
    vm.addItem = addItem
    vm.archiveCompleted = archiveCompleted
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
      if(!node || !node.item || !node.children || node.item.hidden){ return [0,0] }
      node.item.childrenTotal = 0
      node.item.childrenCompleted = 0
      node.children.forEach(function(child){
        if(child.hidden) { return false; }
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

    function isShowable(value, index, array) {
      return !value.hidden
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
      if(!vm.changed[i.id]) {
        vm.changed[i.id] = true
      }
      vm.tally(vm.tree[null])
    }

    function goBack() {
      vm.selectItem(vm.tree[vm.cnode.item.parent].item)
    }

    function itemPicker(ev, callback) {
      // TODO -- Make this work
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

    function archiveCompleted(item) {
      var getAll = function(node) {
        var out = []
        node.children.forEach(function(el) {
          out.push(el)
          out = $.merge(out, getAll(vm.tree[el.id]))
        })
        return out
      }

      var getCompleted = function(node) {
        var out = []
        node.children.forEach(function(el){
          if (el.complete) {
            out.push(el)
            out = $.merge(out, getAll(vm.tree[el.id]))
          } else {
            out = $.merge(out, getCompleted(vm.tree[el.id]))
          }
        })
        return out
      }

      var n = vm.tree[null]
      if(item && item.id && vm.tree[item.id]) {
        n = vm.tree[item.id]
      }
      var items = getCompleted(n)
      ItemService.archive(
        $.map(items, function(e){return e.id}),
        function() {
          $.each(items, function(i,e) {e.hidden = true})
          vm.tally(vm.tree[null])
        }
      )
    }

    // Round up changed items and tell ItemService to commit them to the server
    function saveItems(ev) {
      var changed = $.map(vm.changed, function(e,i){return vm.tree[i].item})
      if(changed.length) {
        ItemService.save(
          changed,
          function() {
            vm.changed = {}
            console.log("Saved!")
          }
        )
      }
    }

    vm.initialize()
  }

  DashController.$inject = ["$mdDialog", "ItemService", "RootItem"]

})();
