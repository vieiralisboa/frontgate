// Router

//TODO router constructor
//  Frontgate.router = new Frontgate.Router({
//      location: situs.location
//  });

(function(router){
    Frontgate.router = router;
    console.info(router.name, router.version.join("."));
})
({
    version: [0, 1, 0],
    name: "Frontgate Router",

    // Route Subscriber
    //-----------------------------------------------------------------
    on: function(route, f){
        var base = this.base(route);

        if(!base) throw 'failed to subscribe route';

        if(!this.routes[base]) this.routes[base] = {};

        if(!this.routes[base][route]){
            this.routes[base][route] = {
                stack: [],
                regExp: this.regExpRoute(route),
                hash: route
            };
        }

        this.routes[base][route].stack.push(f);

        return route;
    },

    // Route Base
    //-----------------------------------------------------------------
    base: function(hash){//'#<base>/:val1/:val2<...>'
        hash = hash || location.hash;
        var match = hash.match(/^#([\w\u00C0-\u00ff]*)\/?/);
        if(match) return match[1];
    },

    onNotFound: null,

    start: function(){
        if(this.started) return;
        this.started = true;

        $(window).on('hashchange', function(e){
            Frontgate.router.route();
        });
    },

    hash: function(hash){
        var hash = hash || location.hash;
        hash = hash.replace("#!", "#");
        return hash;
    },

    // Route Publisher
    //-----------------------------------------------------------------
    route: function(hash, callback){
        hash = this.hash(hash);

        // base is the main hash before first slash (#<base>/)
        var base = this.base(hash);

        if(!this.routes[base]) {
            //console.error("level_1 route not found", arguments);

            if(typeof this.onNotFound == 'function')
                this.onNotFound(hash, base);

            if(typeof callback == 'function') callback(404, base);

            return false;
        }

        // find route match
        for(var i in this.routes[base]){// route => '#<base>/:value'
            var route = this.routes[base][i];

            if(hash.match(route.regExp)){
                var routeHash = this.regExpHash(route.hash, hash);
                var stack = route.stack;
                for(var j in stack) stack[j](routeHash);

                if(typeof callback == 'function')
                    callback(routeHash, base, route);

                return routeHash;
            }
        }

        // Hash has no match (route not found)
        if(typeof this.onNotFound == 'function'){
            //console.error("level_2 route not found", arguments);

            this.onNotFound(hash, base, route);
            if(typeof callback == 'function')
                callback(routeHash, base, route);
        }

        return false;
    },

    // Hash Parser
    //-----------------------------------------------------------------
    regExpHash: function(route, hash){
        hash = hash || location.hash;

        var regExp = this.regExpRoute(route);

        var match = {
            req: route.match(regExp),
            res: hash.match(regExp),
            attr: {}
        };

        for(var i=1; i < match.req.length; i++){
            match.attr[match.req[i]] = match.res[i];
        }

        return match;
    },

    // Route Regular Expression
    //-----------------------------------------------------------------
    regExpRoute: function(route) {
        var base = this.base(route);
        var hashArray = route.replace(new RegExp('^#'+base+'/'),'')
            .split('/');

        var regexp = "^#"+base;

        // Calling the Base
        if(hashArray.length == 1 && hashArray[0] == "#"+base){
            //console.log('hash array',hashArray);

            return new RegExp(regexp + "$");
        }

        var defaultPart = '\\:?([\\w\\.\\-]*)';//\\_
        var lastPart = '\\:?(.*)';
        var last = hashArray.length - 1;

        for(var i in hashArray) {
            regexp += "\/";//'(?P<'+hashArray[i].substring(1)+'>[\w_-\.]*)'

            regexp += hashArray[i].substring(0, 1) == ':' ?
                ( i == last ? lastPart : defaultPart ) : hashArray[i];
        }

        regexp += "$";
        return new RegExp(regexp);
    },
    routes: {}
});
