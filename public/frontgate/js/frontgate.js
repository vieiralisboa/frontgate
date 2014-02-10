// Frontgate JavaScript Library

(function(frontgate){

    window.btoa = window.btoa || frontgate.btoa

    var Frontgate = function(attributes){
        attributes = attributes || {};

        // Location Private Object
        var _attr_ = {
            protocol: window.location.protocol,
            host: window.location.host,
            hostname: window.location.hostname,
            port:  window.location.port,
            pathname: window.location.pathname.match(/^(\/(\w+\/)*)/)[0]
        };

        // Apps Private Object
        var _apps_ = {};

        this.Apps = function(name, app){
            if(!arguments.length) return _apps_;
            if(typeof app == "undefined") {
                if(_apps_[name]) return _apps_[name];
                return;
            }

            if(_apps_[name]) throw "app with same name already exists";
            _apps_[name] = app;

            return app;
        };

        // Location attributes
        //---------------------------------------------------------------------
        this.attr = function(attr, value){ //console.log(attr + " => " + value);
            if(!arguments.length) return _attr_;

            // only one argument
            if(typeof value == "undefined") {
                // argument is a key name
                if(typeof attr == "string") return _attr_[attr];

                // argument is an object
                for(var k in attr) this.attr(k, attr[k]);

                return this;
            }

            if(attr != 'user' && attr != 'pw' && attr != 'host'){
                _attr_[attr] = value;
            }

            else throw 'can not set attr:' + attr ;

            if(attr == 'hostname' || attr == 'port') {
                var hostname = attr.hostname || _attr_.hostname;
                var port = attr.port || _attr_.port;
                _attr_.host = hostname + (!port || port == 80 ? "" : ":" + port);
            }

            return this;
        };

        this.attr(attributes);

        // HREF
        // Absolute location url to home or to resourse.
        //
        // @param string absolute path from home to resourse
        // @return string home url or resourse url
        // @example Frontgate.href();// http://www.example.com:8080/homedir
        // @example Frontgate.href('/js/main.js');
        // http://www.example.com/home/js/main.js
        //---------------------------------------------------------------------
        this.href = function(resource){
            // www.example.com, www.example.com:8080
            var host = this.attr('host');

            // /, /directory
            var pathname = this.attr('pathname');

            // resourses: /resourse.jpg, /dir/resourse.html
            // ensure the host and pathname are separated by a slash
            var address = host + "/" + pathname;

            // address: example.com/directory/dir/resourse.jpg
            // ensure the resourse is separated by a slash
            if(typeof resource == 'string') {
                address = address + "/" + resource;
            }

            // url http://example.com/directory/dir/resourse.jpg
            // replace multiple slashes with only one slash
            var url = address.replace(/\/+/g, "/");

            return this.attr('protocol') + "//" + url;
        };

        // HREFAUTH URL with basic Authentication
        //---------------------------------------------------------------------
        //TODO Situs.hrefAuth('myTV/show/');
        // http://user:pw@situs.no-ip.org:8080/myTV/show/
        this.hrefAuth = function(url){
            url = url || '';
            if(!this.attr('user') || !this.attr('pw')) return this.href(url);

            var host = this.attr('port') == 80 ? this.attr('hostname') :
                this.attr('host');
            var user = this.attr('user');
            var pw = this.attr('pw');
            var pathname = this.attr('pathname');
            var uri = host + '/' + pathname + '/' + url || '';
            var href = this.attr('protocol') + "//" + user+':'+encodeURIComponent(pw)+'@'+uri.replace(/\/+/g,"/");

            return href;
        };

        // Script
        //---------------------------------------------------------------------
        this.script = function(src, callback){
            var script = this.href(src);
            Frontgate.loadScript(script, callback);
            //console.log("Frontgate.script", script);
            return this;
        };

        // Stylesheet
        //---------------------------------------------------------------------
        this.stylesheet = function(href){
            Frontgate.loadStylesheet(this.href(href));
            return this;
        };

        // Template
        //---------------------------------------------------------------------
        this.template = function(src, callback){
            Frontgate.loadTemplate(this.href(src), callback);
            return this;
        };

        // sync
        // Frontgate.sync('/jQuery/jquery.js', // load jQuery
        //      '/underscore/underscore.js', //load Underscore after jQuery
        //      '/backbone/backbone.js', // load Backbone after Underscore
        //       function(){
        //          console.log('now I can use $, _ and Backbone');
        //          $('body').css('background-color','black');
        //          _.forEach([1,2,3], function(n){ console.log(n); });
        //      }, '/dev/frontgate/js/hello.js');
        // });
        //---------------------------------------------------------------------
        this.sync = function(){
            var scripts = [];
            // href the js script arguments
            for(var i in arguments){
                // argument is a script
                if(typeof arguments[i] == 'string'
                        && arguments[i].match(/\.js$/)) {
                    scripts.push(this.href(arguments[i]));
                }
                else if(typeof arguments[i] == 'function'){
                    scripts.push(arguments[i]);
                }
            }

            //DEV logs the arguments
            //console.log('Frontgate.loadSync(', scripts, ')');

            // loads the scripts synchronously
            this.Location.loadSync.scripts(scripts);

            // keeps chainning
            return this;
        };

        // alias for sync
        this.scripts = this.sync;

        // Basic Authorization
        // Sets or gets basic auth base64 string 'user:pw'
        // @param object|undefined {user:user, pw:pw}
        // @return object|string
        // @example auth({user:'guest', pw:'guest'}).auth();// 'Z3Vlc3Q6Z3Vlc3Q='
        //---------------------------------------------------------------------
        this.auth = function(credentials){
            if(typeof credentials == 'undefined') return this.attr('auth');

            credentials.user = credentials.user || this.attr('user');
            credentials.pw = credentials.pw || credentials.user;

            _attr_.user = credentials.user;
            _attr_.pw = credentials.pw;
            _attr_.auth = btoa(credentials.user + ":" + credentials.pw);

            //TODO remove 'userChange' event and keep 'userchange' event
            if(this.publishEvent) this.publishEvent('userChange', _attr_);
            if(this.publishEvent) this.publishEvent('userchange', _attr_);

            return this;
        };

        // set user
        this.auth({
            user: 'anonymous'
        });

        // XHR Auth
        // Gets a function that sets Basic Authorization Header on a xhr object
        // @param string user the username
        // @param string pw the password
        // @return function the setter of basic Authorization Header on a xhr object
        // @example xhrAuth('guest', 'guest');// f(xhr){ xhr.setRequestHeader("Authorization", "Basic Z3Vlc3Q6Z3Vlc3Q="); }
        //---------------------------------------------------------------------
        this.xhrAuth = function(user, pw){
            var self = this;
            var auth = function(){
                if(!user || !pw) return self.attr('auth');
                else return btoa(user + ":" + pw);
            };

            return function(xhr) {
                //console.log('XHR auth()', auth());

                xhr.setRequestHeader("Authorization", "Basic " + auth());
                xhr.withCredentials = true;
            };
        };

        // sets basic authorization (and auth attribute)
        // requires jQuery
        if(typeof attributes.user != 'undefined'
                && typeof attributes.pw != 'undefined')
            this.auth({
                user: attributes.user,
                pw: attributes.pw
            });

        this.Location = Frontgate;

        for(var i in frontgate){
            if(!this[i]) {
                //console.log('adding Frontgate',typeof frontgate[i],i);
                this[i] =  frontgate[i];
            }
            //else console.log(i, 'EXISTS in Frontagate');
        }

        this._on(this);
    };

    //-------------------------------------------------------------------------
    // Location free methods (free as in 'do not depend of')
    //TODO remove from instace keep only in Frontgate?
    //-------------------------------------------------------------------------
    for(var i in frontgate) if(!Frontgate[i]) Frontgate[i] =  frontgate[i];

    window.Frontgate = new Frontgate;

    console.info(frontgate.name, frontgate.version.join("."));
})
({
    name: "Frontgate",
    version: [0, 2, 0],

    // Load Script
    //-------------------------------------------------------------------------
    loadScript: function(src, callback){
        //TODO check if the DOM already has a script element with this src
        // skip if the script is already appended to the DOM

        var script = document.createElement('script');
        script.setAttribute('type','text/JavaScript');
        script.setAttribute('src', src);
        script.onload = function(){
            if(typeof callback == 'function') callback(script);
        };
        (document.getElementsByTagName("head")[0]).appendChild(script);
        return this;
    },

    // Load Synchronized scripts
    // loadSync.scripts(script1, script2, f1, script3, f2 );
    //-------------------------------------------------------------------------
    loadSync: {

        script: function(url, callback){
            // create a script element
            var script = document.createElement('script');
            script.setAttribute('type','text/JavaScript');
            script.setAttribute('src',url);

            // subscribe the script to the statechange event
            script.onreadystatechange = function () {
                if (this.readyState == 'complete'){

                    //console.log('onreadystatechange', url);

                    callback(script);
                }
                //else console.log('loading', url, this.readyState);
            };

            // subscribe the script to the load event
            script.onload = function (){
                //console.log('loaded', url);
                callback(script);
            };

            // append (load) the script
            var head = document.getElementsByTagName("head");
            head[0].appendChild(script);

            // return the script element
            return {
                src: url,
                el: script
            };
        },

        scripts: function(scripts){
            var sync = Frontgate.Location.loadSync;

            if( scripts.length ){
                // next argument is a function
                while(typeof scripts[0] == 'function'){
                    var res = (scripts.shift())();

                    // if res is a script uri, put it back in the arguments
                    if(res && res.match(/^(http:)?\/\/[\w\/]*.js$/i)){
                        scripts.unshift(res);
                        break;
                    }
                }

                if( scripts.length ) sync.script( scripts.shift(), function(script){
                    sync.scripts(scripts);
                });
            }
            //else console.log('loadSync done');
        }
    },

    // Template 1
    // gets Remote Template
    // requires jQuery
    // uses $.get(url, callback)
    //-------------------------------------------------------------------------
    loadTemplate: function(url, callback){
        // validate argumets here

        $.get(url, function(){
            var template = arguments[0];

            // validate template here

            callback(template);
        });

        return;//TODO return validation
    },

    // load Template 2
    // gets local or Remote Template
    // uses $(el).load(url, callback) to get remote tmpl
    // src example: 'templates/name_template.html';
    //-------------------------------------------------------------------------
    loadTemplate2: function(src, callback){
        // make id from template name
        var id = id || src.match(/\/([a-zA-Z0-9_-]+)\.html$/)[1];

        // template (or template with same id) already loaded
        if($('#'+id).length){
            if(typeof callback != 'undefined') callback($('#'+id).html());
            else return $('#'+id).html();
            return;
        }

        // add template contents to a <script> and append it to the body
        $('<script>').attr({id: id, type: 'text/Template'}).load(src,
            function(response, status, xhr){
                if (status == "error") {
                    var msg = "Sorry but there was an error: ";
                    //console.log(msg, xhr.status, xhr.statusText);
                }
                else {
                    if(typeof callback != 'undefined'){
                        callback(response);
                    }
                    //console.log(response);
                }
            }).appendTo('body');
    },

    // get/set attribute without jquery
    //-------------------------------------------------------------------------
    attribute: function(el, attr, val){
        if(typeof val == 'undefined')
            return (document.getElementsByTagName(el)[0]).getAttribute(attr);
        (document.getElementsByTagName(el)[0]).setAttribute(attr, val);
    },

    //-------------------------------------------------------------------------
    appendLink: function(link){
        var el = document.createElement('link');
        for(var attr in link) {
            el.setAttribute(attr, link[attr]);
            (document.getElementsByTagName("head")[0]).appendChild(el);
        }
    },

    //-------------------------------------------------------------------------
    forEach: function(list, f){
        while(list.length){
            f(list.shift());
        }
    },

    //-------------------------------------------------------------------------
    loadStylesheet: function(href){
        var stylesheet = {media:"screen", type:"text/css", rel:"stylesheet",
            href: href};
        this.appendLink(stylesheet);
        return this;
    },

    //-------------------------------------------------------------------------
    basename: function(path) {
        return path.replace(/\\/g, '/').replace( /.*\//, '');
    },

    //-------------------------------------------------------------------------
    dirname: function(path) {
        return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
    },

    LOG: false,

    //TODO move into dependent Frontgate
    _on: function(o){
        //console.log('FRONTGATE EVENT HANDLER', o);

        o.publishEvent = function(event, data){
            //console.log('<<<'+event+'>>>', this);
            if(this.events[event]) this.events[event](data);
        }

        o.events = {};

        o.subscribeEvent = function(name, f){
            // event doesn't exist
            if(!this.events[name]){
                // event
                this.events[name] = function(e){
                    for(var i in this[name].stack) this[name].stack[i](e);
                };
                // event stack
                this.events[name].stack = [];
            }
            // add to event stack
            this.events[name].stack.push(f);
        };
    },

    //-------------------------------------------------------------------------
    set: function($el, data){
        this._set($el, data, ['text', 'html', 'css', 'attr', 'click']);
        return $el;
    },

    //-------------------------------------------------------------------------
    _set: function(o, data, properties){
        for(var i in properties) {
            if(data[properties[i]]){
                o[properties[i]](data[properties[i]]);
            }
        }
        return o;
    },

    // Frontgate.b64(utf8) utf8_to_b64
    b64: function(str){
        return window.btoa(unescape(encodeURIComponent( str )));
    },

    // Frontgate.utf8(b64)b64_to_utf8
    utf8: function(str){
        return decodeURIComponent(escape(window.atob( str )));
    },

    // base64 encode
    btoa: function(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        input = escape(input);
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) enc3 = enc4 = 64;
            else if (isNaN(chr3)) enc4 = 64;

            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        }
        while (i < input.length);

        return output;
    }
});
