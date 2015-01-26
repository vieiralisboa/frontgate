// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Google Analytics (ga_id = 'UA-XXXXX-X')
(function(enabled){
    var ga = $('html').attr('data-ga');
    if(!enabled || !ga) return;
    //console.log('Google Analytics id', ga_id);
    window._gaq = [['_setAccount', ga], ['_trackPageview']];
    var gaScript = document.createElement('script'), 
        firstScript = document.getElementsByTagName('script')[0];
    gaScript.src = '//www.google-analytics.com/ga.js';
    firstScript.parentNode.insertBefore(gaScript, firstScript);
})(false);

// Local Storage overide
//-----------------------------------------------------------------------------
window.myStorage = {
    setItem: function(item, value){
        if(window.localStorage) localStorage.setItem(item, value);
        else return false;
    },
    setItems: function(items){
        if(window.localStorage) 
            for(var i in items) localStorage.setItem(i, items[i]);
        else return false;
    },   
    getItem: function(item){
        if(window.localStorage ) return localStorage.getItem(item);
        else return false;
    }, 
    getItems: function(items){
        if(window.localStorage){
            var result = {};
            for(var i in items) result[i] = localStorage.getItem(items[i]);
            return result;
        }             
        else return false; 
    },
    removeItem: function(item){
        if(window.localStorage) localStorage.removeItem(item);            
        else return false;
    },
    removeItems: function(items){
        if(window.localStorage) for(var i in items) 
            localStorage.removeItem(items[i]);           
        else return false;
    }
}