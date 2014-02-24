<?php
//bars.php

// HTML template
bars('index.html', $json);

/**
 * Bars
 * requires Bar class
 */
function bars($HTML, $JSON)
{
    // path to this script
    $PATH = dirname(__FILE__) . "/";

    // template
    if(file_exists("$PATH/html/$HTML"))
    {
        $html = file_get_contents("$PATH/html/$HTML");
    }

    // get json data
    if(file_exists("$PATH/json/$JSON"))
    {
        $json = file_get_contents("$PATH/json/$JSON");
    }

    // renders the page contents
    if(!empty($html) && !empty($json))
    {
        // decodes json data
        $config = json_decode($json);

        // noscript wrap body contents?
        $config->noscript = true;

        // html data attributes
        $data = array();

        // Remote location is enabled
        if(!$config->remote->disabled)
        {
            // get Remote Location headers
            $headers = get_headers("http://{$config->remote->hostname}/index.html", 1);
            //die("https://{$config->remote->hostname}/index.html");
        }

        // user agent SO
        $OS = array('Windows', 'Win', 'Android', 'Linux', 'Mac', 'X11');
        foreach ($OS as $os) {
            $pos = stripos(strtolower($_SERVER['HTTP_USER_AGENT']), strtolower($os));
            if( $pos !== false ) {
                $config->data->os = $os;
                break;
            }
        }

        // received headers from the server (Remote location is online)
        if($headers)
        {
            $config->data->remote_hostname = $config->remote->hostname;
            $config->data->remote_protocol = $config->remote->protocol;
            $host = $config->remote->protocol."//".$config->remote->hostname;
            $config->data->remote_host = $host;
            $config->data->host = $config->host;

            $data[] = str_replace('X', preg_match('/^HTTP\/\d\.\d\s+(200|301|302|404)/', $headers[0]), 'data-remote_status="X"');
        }
        else $config->noscript = false;// remote location is offline (or disabled)

        // get snapshot
        include "shebang.php";

        // data attributes on html element
        foreach ($config->data as $key => $value)
        {
            if($key != "_")
            {
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
        $bars = str_replace("%style%",
                "@import url(\"css/bar.css\");",
                "<style type='text/css'>%style%</style>\n") . $bars;
        $bars = $config->noscript ? str_replace("%bars%", $bars, "<noscript>%bars%</noscript>"): $bars;
        $html = str_replace("<!-- bars -->", $bars, $html);

        // template values
        if(empty($config->head->lang))
        {
            // language
            $config->head->lang = "en";
        }

        if(empty($config->head->script))
        {
            // javascript
            $config->head->script = "";
        }

        if(empty($config->head->stylesheet))
        {
            // stylesheet
            $config->head->stylesheet = "";
        }

        foreach($config->head as $name => $value)
        {
            // set template value
            $html = str_replace("%$name%", $value, $html);
        }

        // render page
        die($html);
    }

    // template and/or data not found
    $file = "$PATH/html/404.html";
    if(file_exists($file))
    {
        die(file_get_contents($file));
    }
}
