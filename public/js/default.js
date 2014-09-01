//!script default.js

//$('html').attr('data-os') != 'Android' || Remote.script("jquery-ui/touch-punch/jquery.ui.touch-punch.min.js");

// contact email
$("#contact").attr("href", "mailto:%address%%query%"
    .replace("%address%", "info%a%situs.pt")
    .replace("%a%", "@")
    .replace("%query%", "?Subject=Frontgste%20Host"));

$('noscript').remove();
$('#notice').find('a').text('Welcome');

// clear notice after 5 seconds
setTimeout(function(){
    $('#notice').fadeOut("slow", function(){
        $(this).find('a').text('');
    });
}, 5000);//*/

// remote location
(function(remote){
    if(!remote) return  $('#notice').find('a').text('#!Shebang').attr({
        "title": "This is a shebang request.",
        "href": "?_escaped_fragment_=Shebang"
    });

    //$.getScript("frontgate/js/frontgate.router.js",
    Frontgate.script("frontgate/js/frontgate.router.js",
            function(data, textStatus, jqxhr){
        // start router
        Frontgate.router.start();

        // create a route
        Frontgate.router.on("#Sítio", function(){
            // similar behavior as an HTTP redirect
            window.location.replace("http://xn--stio-vpa.pt");

            // similar behavior as clicking on a link
            //window.location.href = "http://xn--stio-vpa.pt";
        });

        //TESTS Frontgate router
        if(false){
            // create routes
            Frontgate.router.on("#Frontgate/router", function(route){
                console.info("route >>>", route.req[0]);
            });
            Frontgate.router.on("#Frontgate/situs", function(route){
                console.info("route >>>", route.req[0]);
            });

            Frontgate.router.route('#Frontgate/router', function(hash, base, _hash, route){
                console.info("route >>>", hash ,">>> callabck", arguments);
            });
            Frontgate.router.route('#Frontgate/situs', function(hash, base, _hash, route){
                console.info("route >>>", hash ,">>> callabck", arguments);
            });

            Frontgate.router.route('#Test2/two', function(hash, base, _hash, route){
                console.info("route >>>", hash ,">>> callabck", arguments);
            });
        }//*/

        // SITUS location
        Situs = new Frontgate.Location({
            hostname: $('html').attr("data-situs_hostname"),// example.com
            pathname: "/",
            port: parseInt($('html').attr("data-situs_port")),
            protocol: $('html').attr("data-situs_protocol")
        });

        $.ajaxSetup({
            beforeSend: Situs.xhrAuth()
        });

        // loading JS Bar
        //----------------------------------------------------------------
        // 1. direct loading with jQuery
        //$.getScript("http://localhost/jquery.bar/js/bar.js", function(){
        // 2. using Frontgate location
        //Frontgate.script("js/bar.js", function(){
        // 3. using Situs Bar controller
        //Situs.script("bar", function(){
        // 4. using Situs Bar controller
        Situs.scripts("_", "bar", function(){

            // loading bar stylesheet
            //--------------------------
            Situs.stylesheet("bar/css");
            //Bar.styles.load(Remote);
            //Bar.API.get("css");

            // make the header bar
            $("#header").bar({
                items:[{
                    text:"FRONTGATE JAVASCRIPT LIBRARY BAR",
                    attr:{
                        style: "color: silver; font-size: 26px; opacity: .25; text-shadow: 0 0 10px 5px black; padding: 3px 6px"
                    }
                }],
                callback: function(bar, app){
                    bar.$bar.css({
                        "background-color": "rgba(255,255,255,.1)"
                    });
                }
            });

            // auto load bars from Situs remote location
            // requires situs controller Bar/Situs
            // requires Frontgate Router
            //-------------------------------------------
            Bar.autoLoad.start(Situs);

            // AUTO LOAD USAGE
            // load bar from script
            switch(0){
                case 0:
                    // route to #Hash auto loads the bar
                    // Bar.route() => Frontgate.router.route()
                    Bar.autoLoad.route("#Frontgate");
                    break;

                //TODO
                // from json file to access bar and app
                case 1:
                    Bar.load("#header", function(bar, app){
                        console.info(arguments);//[Bar, bar Object]
                    }, { jsonp: "jquery.bar/js/bar.Frontgate.json" });

                    //$("#header").bar("bar.Frontgate.json", callback);
                    break;

                case 2:
                    // from route >>> js script
                    Bar.route("#Frontgate", function(){
                        console.info(arguments);//["#Frontgate", "Frontgate", 0, "success"]
                    });
                    break;

                case 3:
                    // from route >>> js script
                    Frontgate.router.route("#Frontgate", function(){
                        console.info(arguments);//["#Frontgate", "Frontgate", 0, "success"]
                    });
                    break;

                case 4:
                    var urls = Bar.urls("#Frontgate");
                    console.info("urls", urls);//{name: "Frontgate", script: "situs/js/bar?Frontgate", hash: "#Frontgate", match: Array[3]}
                    Bar.getBar(urls, function(){
                        console.info(arguments);//[undefined, "success", jqxhr Object]
                    });
                    break;

                case 5:
                    location.hash = location.hash=="#Frontgate"? "#!Frontgate" : "#Frontgate";
                    break;
                default:
            }//*/
        });
    });
})($("html").attr("data-remote"));
