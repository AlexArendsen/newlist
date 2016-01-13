<?php
  require_once 'init.php';

  if(!$loggedIn) {
    header("Location: login.php");
  } else {
    echo $twig->render("dash.html", $args);
  }
?>
