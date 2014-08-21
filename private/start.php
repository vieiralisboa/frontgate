<?php
//start.php

error_reporting(0);

// Default Host Settings
if(empty($json)) $json = 'default.json';

// Load Config file
$root = dirname(__FILE__);
$conf = "$root/start.json";
if(file_exists($conf)){
    $start = json_decode(file_get_contents($conf));
    if(!empty($start->json)) $json = $start->json;
}
else $start = (object) array("error_reporting" => -1);

// Error Reporting from config
if($start->error_reporting != 0) {
	error_reporting(-1);
}

// Host settings exist
if(!empty($json)){
	include "bars.php";
}
else {
	// Not Found error
	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
	die("404 Not Found");
}
