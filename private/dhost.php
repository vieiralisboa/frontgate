<?php

$server_name = null;

//----------
// Redirect
//----------
if(isset($start->redirect)) {
    foreach($start->redirect as $name => $url) {
        if($name == $_SERVER['SERVER_NAME']) {
            header('Location: '.$url);
            exit;
        }
    }
}

//-------
// Alias
//-------
if(isset($start->alias)) {
    foreach($start->alias as $host => $alias) {
        foreach($alias as $name) if($name == $_SERVER['SERVER_NAME']) {
            $server_name = $host;
            break;
        }
        if(!empty($server_name)) break;
    }
}

if(empty($server_name)) $server_name = $_SERVER['SERVER_NAME'];

// Dynamic Host filename
$json = $server_name.".json";
$jsonfile = dirname(__FILE__)."/json/".$json;

// Default Host fallback
if(!file_exists($jsonfile)) {
    $json = 'default.json';
    $jsonfile = dirname(__FILE__)."/json/".$json;
}

// Host settings
$CONF = json_decode(file_get_contents($jsonfile));

// validate Host settings
if(empty($CONF->bars)){
    // Host Not Found
    header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
    $not_found = dirname(__FILE__)."/html/404.html";
    if(file_exists($not_found)) die(file_get_contents($not_found));
    else die("404 Not Found");
}

// Bars
include "bars.php";
