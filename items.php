<?php
  require_once 'init.php';

  function get_items($i) {
    if($s=$i->prepare("SELECT ID, PUBLIC_ID, TITLE, DESCRIPTION, PARENT, COMPLETE FROM ITEMS WHERE OWNER = ? AND ARCHIVED = 0")) {
      $s->bind_param('i',$_SESSION['user-id']);
      $s->bind_result($id, $public_id, $title, $description, $parent, $complete);
      if($s->execute()) {
        // Query success
        $out = array();
        while($s->fetch()) {
          $out[] = array(
            "id" => $id,
            // "public_id" => $public_id,
            "title" => $title,
            // "description" => $description,
            "parent" => $parent,
            "complete" => $complete == 1
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
    if($s=$i->prepare("SELECT ID, PUBLIC_ID, TITLE, DESCRIPTION, PARENT, COMPLETE FROM ITEMS WHERE OWNER = ? AND PUBLIC_ID = ?")) {
      $s->bind_param('is',$_SESSION['user-id'], $public_id);
      $s->bind_result($id, $public_id, $title, $description, $parent, $complete);
      if($s->execute() && $s->fetch()) {
        // Query success
        return json_encode(array(
          "id" => $id,
          // "public_id" => $public_id,
          "title" => $title,
          // "description" => $description,
          "parent" => $parent,
          "complete" => $complete == 1
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
    $uuid = uniqid();
    if($s=$i->prepare("INSERT INTO ITEMS (PUBLIC_ID, TITLE, PARENT, OWNER) VALUES (?,?,?,?)")) {
      if (!$parent) { $parent = null;  }
      $s->bind_param("ssii", $uuid, $title, $parent, $_SESSION['user-id']);
      if($s->execute()) {
        // Query success
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

  function save_items($i, $items) {
    $items = json_decode($items, true);
    $errors = array();
    if($s=$i->prepare("UPDATE ITEMS SET TITLE = ?, COMPLETE = ? WHERE ID = ? AND OWNER = ?")) {
      foreach ($items as $i) {
        $s->bind_param('siis',$i['title'], $i['complete'], $i['id'], $_SESSION['user-id']);
        if(!$s->execute()) { $errors[] = $i->error; }
      }
      $s->close();
      if(count($errors)) {
        error_log("Encountered errors while saving items: ".print_r($errors, true));
      }
    } else {
      error_log("There was an error while preparing the item save statement: $i->error");
    }
  }

  function archive_items($i, $ids) {
    $ids = json_decode($ids);
    if($s=$i->prepare("UPDATE ITEMS SET ARCHIVED = 1 WHERE ID = ? AND OWNER = ?")) {
      foreach ($ids as $i) {
        $s->bind_param('is',$i, $_SESSION['user-id']);
        if(!$s->execute()) { $errors[] = $i->error; }
      }
      $s->close();
      if(count($errors)) {
        error_log("Encountered errors while archiving items: ".print_r($errors, true));
      }
    } else {
      error_log("There was an error while preparing the item archive statement: $i->error");
    }
    json_error("There was actually no error...");
  }

  $action = array_get($_POST, "a", "dump");
  switch($action) {
    case 'dump':
      echo get_items($i);
      break;
    case 'add':
      echo add_item($i, $_POST['title'], $_POST['parent']);
      break;
    case 'save':
      echo save_items($i, $_POST['items']);
      break;
    case 'archive':
      echo archive_items($i, $_POST['ids']);
      break;
  }
  
?>
