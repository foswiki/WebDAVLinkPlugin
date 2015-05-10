var webdavlink = {
    version: "$Rev: 1215 $",
    copyright: "Copyright (C) 2009-2013 C-Dot Consultants http://c-dot.co.uk",
    defaultExec: ".* = /usr/bin/ooffice",
    debug: false,

    // Messages appear in the browser console until the firebug console is ready
    report: function(str) {
	var console = Components.classes['@mozilla.org/consoleservice;1']
            .getService(Components.interfaces.nsIConsoleService);
	if (console)
            console.logStringMessage('WebDAVLinkPlugin: ' + str);
	else
	    alert("No console: "+str);
    },

    /**
     * When the extension is loaded, add a handler to the DOM content
     * container. The handler will be invoked before any in-page handlers
     * (including onload)
     */
    onExtensionLoad: function() {
        // initialization code
	var appcontent = document.getElementById("appcontent");  
        if (appcontent) {
            appcontent.addEventListener(
                "DOMContentLoaded",
		function(evt) {
		    evt.originalTarget.addEventListener(
			"webdav_open", webdavlink.handleClick, true);
		},
		true);
	} else
	    this.report('No appcontent');
    },

    /**
     * Get the application that matches the url
     */
    getAppFor: function(url) {
        var appList = this.defaultExec;
        try {
	    var prefs = Components.classes['@mozilla.org/preferences-service;1']
		.getService(Components.interfaces.nsIPrefService);
            appList = prefs.getCharPref('extensions.webdavlink.apps');
	    // while we have prefs in hand.....
	    this.debug = prefs.getBoolPref("extensions.webdavlink.debug");
        } catch (e) {
	    this.report("extensions.webdavlink.apps preference missing");
        }
        var apps = appList.split(';');
        for (var i in apps) {
            var o = apps[i].split(/\s*=\s*/, 2);
            var re = new RegExp(o[0]);
            if (re.test(url)) {
                return o[1];
            }
        }
	return null;
    },

    /**
     * Handler for when a webdav link is hit.
     */
    handleClick: function(evt) {
        var ele = evt.originalTarget;

        if (webdavlink.debug)
            webdavlink.report("handling link to "
			      + ele + " link " + ele.href);

        var app = webdavlink.getAppFor(ele.href);

        if (!app) {
	    alert("WebDAVLinkPlugin has no registered application for " + ele.href);
            return false;
	}

        try {
            var appFile = Components.classes['@mozilla.org/file/local;1']
		.createInstance(Components.interfaces.nsILocalFile);
            appFile.initWithPath(app);
            if (!appFile.exists()) {
                alert("Failed to start " + app + ": not found");
                return true;
            }
            if (webdavlink.debug)
                webdavlink.report("launching " + appFile
				  + " " + ele.href);
            var process = Components.classes['@mozilla.org/process/util;1']
		.createInstance(Components.interfaces.nsIProcess);
            var param = new Array();
            param.push(ele.href); // add address
            process.init(appFile); // initialize process
            process.run(false, param, param.length); // launch executable
        } catch (e) {
            alert("Failed to start "+ app + ": " + e);
        }
        return false;
    }
};

window.addEventListener(
    "load",
    function(e) {
        webdavlink.onExtensionLoad(e);
    }, false);
