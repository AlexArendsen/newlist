<?php
  require_once 'init.php';

  function login_error($twig, $args, $message) {
    $args['login_message'] = $message;
    echo $twig->render("login.html", $args);
  }

  function check_login($i, $twig, $args) {
    if($s=$i->prepare("SELECT ID, PASSWORD, USERNAME FROM USERS WHERE USERNAME = ?")) {
      $s->bind_param('s',$_POST['username']);
      $s->bind_result($uid, $upass, $uname);
      if($s->execute()) {
        // Query success
        if ($s->fetch() && password_verify($_POST['password'], $upass)) {
          // Login success
          $_SESSION['user-id'] = $uid;
          $_SESSION['user-username'] = $uname;
          header("Location: index.php");
        } else {
          // Login failure
          login_error($twig, $args, "Invalid login");
        }
      } else {
        // Execution Failure
        error_log("Login error, execution: $i->error");
        login_error($twig, $args, "There was an internal error while logging in. Please contact your administrator.");
      }
      $s->close();
    } else {
      // Preparation Failure
      error_log("Login error preparation: $i->error");
      login_error($twig, $args, "There was an internal error while logging in. Please contact your administrator.");
    }
  }

  // Driver
  if(isset($_POST['username'])) {
    check_login($i, $twig, $args);
  } else {
    echo $twig->render("login.html", $args);
  }
?>
