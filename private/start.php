<?php
//start.php
error_reporting(0);

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

// Dynamic Host
include "dhost.php";
