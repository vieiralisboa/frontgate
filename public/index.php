<?php

//TODO "ssl": true, in config file
/*/ Redirect browser to ssl webpage
if($_SERVER['HTTPS'] != "on") {
	header("Location: https://xn--stio-vpa.pt/frontgate/");
	exit;
}//*/

// settings file (in the private folder)
$json = 'default.json';

include "../private/start.php";
