<?php

// Dynamic Host filename
$json = "{$_SERVER['SERVER_NAME']}.json";
$jsonfile = dirname(__FILE__)."/json/".$json;

// Default Host fallback
if(!file_exists($jsonfile))	{
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
