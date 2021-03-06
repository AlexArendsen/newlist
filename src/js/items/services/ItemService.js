(function() {
  'use strict';

  angular
    .module('newlist')
    .factory('ItemService', ItemService)

  function ItemService(HTTPService, ErrorService) {
    return {
      dump: function ItemServiceDump(callback) {
        HTTPService.post(
          "items.php",
          {a:"dump"},
          callback,
          "There was an error while decoding the items..."
        )
      },

      add: function ItemServiceAdd(title, parent, callback) {
        HTTPService.post(
          "items.php",
          {a: "add", title: title, parent: parent},
          callback,
          "There was an error while retrieving the newly created item..."
        )
      },

      save: function ItemServiceSave(items, callback) {
        HTTPService.post(
          "items.php",
          {a: "save", items: JSON.stringify(items)},
          callback,
          "There was an error while saving items..."
        )
      },

      archive: function ItemServiceArchive(ids, callback) {
        HTTPService.post(
          "items.php",
          {a: "archive", ids: JSON.stringify(ids)},
          callback,
          "There was an error while archiving the completed items..."
        )
      }
    }
  }

  ItemService.$inject = ["HTTPService", "ErrorService"]
})();
