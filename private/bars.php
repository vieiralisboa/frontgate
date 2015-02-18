<?php

// HTML template
bars('index.html', $CONF);

/**
 * Bars
 * requires Bar class
 */
function bars($HTML, $config)
{
    // this script's parent folder
    $PATH = dirname(__FILE__)."/";

    // template
    if(file_exists("$PATH/html/$HTML")) {
        $html = file_get_contents("$PATH/html/$HTML");
    }

    // renders the page contents
    if(!empty($html) && !empty($config)){

        // detect user agent SO
        $OS = array('Windows', 'Win', 'Android', 'Linux', 'Mac', 'X11');
        foreach ($OS as $os) {
            $pos = stripos(strtolower($_SERVER['HTTP_USER_AGENT']), strtolower($os));
            if( $pos !== false ) {
                $config->data->os = $os;
                break;
            }
        }

        // html data attributes
        $data = array();

        $config->noscript = false;

        $remote = 0;

        // Remote location is enabled
        if(!$config->remote->disabled) {
            // get Remote Location headers
            $headers = get_headers($config->remote->script, 1);
            if($headers) {
                $remote = preg_match('/^HTTP\/\d\.\d\s+(200|301|302)/', $headers[0]);
            }
            // Remote location is online
            if($remote) {
                // to wrap body contents with noscript (fallback for js disabled browsers)
                $config->noscript = true;
                // to load remote script
                if(isset($config->remote->script)) {
                    $config->head->script = $config->remote->script;
                }
            }
        }
        $data[] = str_replace('X', $remote, 'data-remote="X"');

        // Situs is enabled
        if(!$config->situs->disabled) {
            $config->data->situs_hostname = $config->situs->hostname;
            $config->data->situs_protocol = $config->situs->protocol;
            $host = $config->situs->protocol."//".$config->situs->hostname;
            if(!empty($config->situs->port)){
                $config->data->situs_port = $config->situs->port;
                $host .= ":".$config->situs->port;
            }

            $config->data->situs = $host;
            $config->data->host = $config->host;
        }

        // get shebang snapshot
        include "shebang.php";

        // data attributes on html element
        foreach ($config->data as $key => $value) {
            if($key != "_"){
                $data[] = str_replace('X', $value, "data-$key=\"X\"");
            }
        }
        $data[] = str_replace('%x%', $_SERVER['REMOTE_ADDR'], 'data-user_addr="%x%"');
        $data[] = str_replace('%x%', $_SERVER['REQUEST_TIME'], 'data-request_time="%x%"');
        $data = implode(" ", $data);
        $html = str_replace("<html", "<html $data", $html);

        // Bars
        require $PATH. "bar.php";
        $bar = new Bar($config->bars);
        $bars = $bar->bars();
        $bars = str_replace("%style%", "@import url(\"/Bar/css/bar.css\");", "<style type='text/css'>%style%</style>\n").$bars;
        $bars = $config->noscript ? str_replace("%bars%", $bars, "<noscript>%bars%</noscript>"): $bars;
        $html = str_replace("<!-- bars -->", $bars, $html);

        // template values
        if(empty($config->head->lang)) {
            // language
            $config->head->lang = "en";
        }

        if(empty($config->head->script)) {
            // javascript
            $config->head->script = "";
        }

        if(empty($config->head->stylesheet)) {
            // stylesheet
            $config->head->stylesheet = "";
        }

        foreach($config->head as $name => $value) {
            // set template value
            $html = str_replace("%$name%", $value, $html);
        }

        // render page
        die($html);
    }

    // template and/or data not found
    $file = "$PATH/html/404.html";
    if(file_exists($file)){
        die(file_get_contents($file));
    }
}
