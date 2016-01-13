<?php
  session_start();
  require_once 'config.php';

  // Connect to MySQL
  $i = new mysqli($MYSQL_HOST,$MYSQL_USER,$MYSQL_PASS,$MYSQL_DBNAME);

  // Start Twig
  require_once 'lib/Twig/Autoloader.php';
  Twig_Autoloader::register();

  $loader = new Twig_Loader_Filesystem('views');
  $twig = new Twig_Environment($loader);
  $lexer = new Twig_Lexer($twig, array(
    "tag_comment" => array('{#', '#}'),
    "tag_block" => array('{%', '%}'),
    "tag_variable" => array('{[{', '}]}'),
    "interpolation" => array('#{', '}'),
  ));
  $twig->setLexer($lexer);

  // Create page args
  $args = array();
  $loggedIn = $args['loggedIn'] = isset($_SESSION['user-id']);

  function json_error($message) {
    echo "{\"error\":\"$message\"}";
  }

  // Conveninence function for a-array fetching
  function array_get($arr, $key, $def=NULL) {
    return (array_key_exists($key, $arr))?$arr[$key]:$def;
  }

?>
