<?php
  require_once 'init.php';

  function get_items($i) {
    error_log("Dumping items");
    if($s=$i->prepare("SELECT ID, PUBLIC_ID, TITLE, DESCRIPTION, PARENT FROM ITEMS WHERE OWNER = ?")) {
      $s->bind_param('i',$_SESSION['user-id']);
      $s->bind_result($id, $public_id, $title, $description, $parent);
      if($s->execute()) {
        // Query success
        $out = array();
        while($s->fetch()) {
          $out[] = array(
            "id" => $id,
            "public_id" => $public_id,
            "title" => $title,
            "description" => $description,
            "parent" => $parent
          );
        }
        return json_encode($out);
      } else {
        // Execution Failure
        error_log("Item dump execution error: There was an error while fetching user's items: $i->error");
        json_error("There was an error while fetching user's items");
      }
      $s->close();
    } else {
      // Preparation Failure
      error_log("Item dump preparation error: There was an error while fetching users's items: $i->error");
      json_error("There was an error while fetching users's items");
    }
  }

  function get_item($i, $public_id) {
    error_log("Fetching item");
    if($s=$i->prepare("SELECT ID, PUBLIC_ID, TITLE, DESCRIPTION, PARENT FROM ITEMS WHERE OWNER = ? AND PUBLIC_ID = ?")) {
      $s->bind_param('is',$_SESSION['user-id'], $public_id);
      $s->bind_result($id, $public_id, $title, $description, $parent);
      if($s->execute() && $s->fetch()) {
        // Query success
        return json_encode(array(
          "id" => $id,
          "public_id" => $public_id,
          "title" => $title,
          "description" => $description,
          "parent" => $parent
        ));
      } else {
        // Execution Failure
        error_log("Item retrieval execution error: There was an error while fetching an item: $i->error");
        json_error("There was an error while fetching an item");
      }
      $s->close();
    } else {
      // Preparation Failure
      error_log("Item retrieval preparation error: There was an error while fetchin an item: $i->error");
      json_error("There was an error while fetchin an item");
    }
  }

  function add_item($i, $title, $parent) {
    error_log("Adding new item...");
    $uuid = uniqid();
    if($s=$i->prepare("INSERT INTO ITEMS (PUBLIC_ID, TITLE, PARENT, OWNER) VALUES (?,?,?,?)")) {
      if (!$parent) { $parent = null;  }
      $s->bind_param("ssii", $uuid, $title, $parent, $_SESSION['user-id']);
      if($s->execute()) {
        // Query success
        error_log("New item created successfully");
        return get_item($i, $uuid);
      } else {
        // Execution Failure
        error_log("New item execution error: There wasn error while adding a new item: $i->error");
        json_error("There wasn error while adding the new item");
      }
      $s->close();
    } else {
      // Preparation Failure
      error_log("New item preparation error: There was an error while adding a new item: $i->error");
      json_error("There was an error while adding the new item");
    }
  }

  $action = array_get($_POST, "a", "dump");
  error_log(print_r($_POST, true));
  switch($action) {
    case 'dump':
      echo get_items($i);
      break;
    case 'add':
      echo add_item($i, $_POST['title'], $_POST['parent']);
      break;
  }
  
?>
