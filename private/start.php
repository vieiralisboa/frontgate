<?php
//start.php

// comment this during development
error_reporting(0);

// config file exists
if(!empty($json))
{
	include "bars.php";
}
else
{
	// Not Found error
	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
	die("404 Not Found");
}
