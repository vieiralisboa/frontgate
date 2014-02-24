//!script default.js

$('html').attr('data-os') != 'Android' || Remote.script("jquery-ui/touch-punch/jquery.ui.touch-punch.min.js");

// contact email
$("#contact").attr("href", "mailto:%address%%query%"
    .replace("%address%", "info%a%situs.pt")
    .replace("%a%", "@")
    .replace("%query%", "?Subject=Frontgste%20Host"));

// remote location
(function(remote){
    $('noscript').remove();
    $('#notice').find('a').text('Welcome');

    if(!remote) return  $('#notice').find('a').text('#!Shebang').attr({
        "title": "This is a shebang request.",
        "href": "?_escaped_fragment_=Shebang"
    });

    // clear notice after 5 seconds
    setTimeout(function(){
        $('#notice').fadeOut("slow", function(){
            $(this).find('a').text('');
        });
    }, 5000);//*/

    $.getScript("https://situs.xn--stio-vpa.pt/situs/js/frontgate?router",
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
        if(0){
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
        }

        // create remote location
        Remote = new Frontgate.Location({
            hostname: $('html').attr("data-remote_hostname"),// example.com
            pathname: "/",
            protocol:  $('html').attr("data-remote_protocol")
        });

        // create situs location
        Situs = new Frontgate.Location({
            hostname: "situs.xn--stio-vpa.pt",
            pathname: "/",
            protocol:  "https:"//!important "https:" and NOT "https"
        });

        $.ajaxSetup({
            beforeSend: Situs.xhrAuth()
        });

        // load Zé Bar
        //if(0)
        Remote.script("jquery.bar/js/bar.js", function(){
            // make the header bar
            $("#header").bar({
                items:[{
                    text:"FRONTGATE JAVASCRIPT LIBRARY",
                    attr:{
                        style: "color: silver; font-size: 26px; opacity: .25; text-shadow: 0 0 10px 5px black; padding: 3px 6px"
                    }
                }],
                callback: function(bar, app){
                    bar.$bar.css({
                        "background-color": "rgba(255,255,255,.05)"
                    });
                }
            });

            // load bar stylesheet from Remote location
            Bar.styles.load(Remote);

            // auto load bars from Situs location
            Bar.start(Situs);// requires situs controller + Frontgate

            Bar.route("#Frontgate");

            // load bar from script
            switch(0){
                // from json file to access bar and app
                case 1:
                    Bar.load("#header", function(bar, app){
                        console.info(arguments);//[Bar, bar Object]
                    }, "jquery.bar/js/bar.Frontgate.json");
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
                    console.log("urls", urls);//{name: "Frontgate", script: "situs/js/bar?Frontgate", hash: "#Frontgate", match: Array[3]}
                    Bar.getBar(urls, function(){
                        console.info(arguments);//[undefined, "success", jqxhr Object]
                    });
                    break;

                case 5:
                    location.hash = location.hash=="#Frontgate"? "#!Frontgate" : "#Frontgate";
                    break;
                default:
            }
        });
    });
})($("html").attr("data-remote_host"));
