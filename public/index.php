<?php

//TODO "ssl": true, in config file
// Redirect browser to ssl webpage
if($_SERVER['HTTPS'] != "on") {
	header("Location: https://xn--stio-vpa.pt/frontgate/");
	exit;
}

// settings file
$json = 'default.json';

// the above files are in the private folder

include "../private/start.php";
