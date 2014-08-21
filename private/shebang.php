<?php
//shebang.php

// get snapshot
shebang($config);

/**
 * Shebang 
 * Bar snapshots of Ajax content for hash bang crawlers
 */
function shebang(&$config){
	// directory for Bar addon (json) files
	$dir = $config->shebang->dir;

	// Default directory for json bar files
	if(!$dir){
		$dir = dirname(__FILE__) . "/json/";
	}

	if(preg_match("/^\/\?_escaped_fragment_\=(.*)?/",
			urldecode($_SERVER['REQUEST_URI']), $matches)){
		$name = urldecode($matches[1]);

		if(empty($name)){
			$name = "Home";
		}

		if($name == "Home"){
			if(!empty($config->shebang->home)) $dir = $config->shebang->home;
			else $dir = dirname(__FILE__) . "/json/";
		}

		#$url = $dir . "bar.$name.json";// works on linux
		$url = $dir . utf8_decode("bar.$name.json");// works on windows

		// $url is a file path or a non secure url (no ssl) 
		$addon = json_decode(file_get_contents($url));
		
		if(empty($addon)){
			if($name != "Home"){
				header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
				die("404 #$name Not Found");
			}

			$addon = (object) array(
				"name" =>  $name,
				"description" => "This is the home page for the «". $config->host ."» host. The Shebang snapshot for this page is not set.",
				"items" => array((object) array( 
						"text" =>  "#!$name",
						"attr" => (object) array(
							"href" => "#$name"
						) 
					)
				)
			);
		}
		// set title with the Bar addon name
		else{
			if($name != "Home"){
				$config->head->title = $addon->name;
			}
		}

		// add bar
		$config->bars->$name = $addon;

		// set description
		$config->head->description = $addon->description;

		// Headline Bar
		$config->bars->Headline = (object) array(
			"items"=> array(
				(object) array( "el"=> "h1", "text" => $addon->name),
				(object) array( "el"=> "span", "text" => $addon->description)
			)
		);

		return;

		// debug
		echo "<pre>";
		$matches[] = "#!" . $matches[1];
		print_r($matches);
		print_r($addon);
		print_r($config->bars);
		die();
	}
}
