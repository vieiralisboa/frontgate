//!script default.js

// contact email
$("#contact").attr("href", "mailto:%address%%query%"
    .replace("%address%", "info%a%situs.pt")
    .replace("%a%", "@")
    .replace("%query%", "?Subject=Frontgste%20Host"));

// remote location
(function(remote){
    if(!remote){

    $('#notice').find('a').text('#!Shebang').attr({
            "title": "This is a shebang request.",
            "href": "?_escaped_fragment_=Shebang"
        });
        return;
    }

    $('#notice').find('a').text('Welcome');

    // clear notice after 5 seconds
    setTimeout(function(){
        $('#notice').fadeOut("slow", function(){
            $(this).find('a').text('');
        });
    }, 5000);

    $.getScript("https://situs.xn--stio-vpa.pt/situs/js/frontgate?router&situs",
            function(data, textStatus, jqxhr){

        if($('noscript').length) $('noscript').remove();

        Remote = new Frontgate.Location({
            hostname: $('html').attr("data-remote_hostname"),// example.com
            pathname: "/",
            protocol:  $('html').attr("data-remote_protocol"),// http/https
            requestHash: location.hash//!important
        });

        Situs = new Frontgate.Location({
            hostname: "situs.xn--stio-vpa.pt",
            pathname: "/",
            protocol:  "https:",//!important "https:" and NOT "https"
            requestHash: location.hash//!important
        });

if(location.hash && !location.hash.match(/^\#\!/)) location.hash = location.hash.replace("#", "#!");

        // start router
        Frontgate.router.start();

        // auto load bars
        Bar.start(Situs);

        // load stylesheet
        Bar.styles.load(Remote);

        Frontgate.router.route("#!Frontgate");

        $.ajaxSetup({
            beforeSend: Situs.xhrAuth()// returns a function
        });

    });

/*/
    var script = "%remote%/hosts/%host%/index.js"
        .replace("%remote%", remote)
        .replace("%host%", location.host.match(/(\w+\.\w+)$/i)[1]);

    $.getScript(script, function(data, textStatus, jqxhr){
        if($('noscript').length) $('noscript').remove();
    });
//*/
})($("html").attr("data-remote_host"));
