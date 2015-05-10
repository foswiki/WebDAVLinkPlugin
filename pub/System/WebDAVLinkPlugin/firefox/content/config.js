webdavlinkOpt = {
    version: "$Rev: 1156 $",
    copyright: "Copyright (C) 2009 C-Dot Consultants http://c-dot.co.uk",
    prefs: null,

    getPrefs: function() {
        if (this.prefs == null) {
            var service =
            Components.classes['@mozilla.org/preferences-service;1']
            .getService(Components.interfaces.nsIPrefService);
            this.prefs = service.getBranch('extensions.webdavlink.');
        }
        return this.prefs;
    },

    loadPrefs: function() {
        var listBox = document.getElementById('webdavlinkOptionsList');
        try {
            var debug = this.getPrefs().getBoolPref('debug');
            if (debug) {
                var debugCB = document.getElementById(
                    'webdavlinkOptionsDebug');
                debugCB.checked = true;
            }
        } catch (e) {
            //alert("WebDAVLinkPlugin: failed to load debug switch: " + e);
        }
        try {
            var apps = this.getPrefs().getCharPref('apps').split(';');
            for (var i in apps) {
                var listItem = document.createElement('listitem');
                listItem.setAttribute("label", apps[i]);
                listBox.appendChild(listItem);
            }
        } catch (e) {
            //alert("WebDAVLinkPlugin: failed to load apps list: " + e);
        }
        this.enableDelete(false);
    },

    enableDelete: function(enable) {
        var del = document.getElementById('webdavlinkOptionsDelete');
        del.disabled = !enable;
    },

    savePrefs: function() {
        var listBox = document.getElementById('webdavlinkOptionsList');
        var ssi = Components.interfaces.nsISupportsString;
        var string = Components.classes["@mozilla.org/supports-string;1"]
        .createInstance(ssi);
        var values = [];
        for (var i = 0; i < listBox.itemCount; i++) {
            var item = listBox.getItemAtIndex(i);
            values.push(item.getAttribute('label'));
        }
        this.getPrefs().setCharPref('apps', values.join(';'));

        var debugCB = document.getElementById('webdavlinkOptionsDebug');
        this.getPrefs().setBoolPref('debug', debugCB.checked ? 1 : 0);
    },

    addPattern: function() {
        var ext = document.getElementById('webdavlinkOptionsPattern');
        var path = document.getElementById('webdavlinkOptionsApp');
        var listBox = document.getElementById('webdavlinkOptionsList');
        var listItem = document.createElement('listitem');
        listItem.setAttribute("label", ext.value + ' = ' + path.value);
        listBox.appendChild(listItem);
        this.savePrefs();
    },

    deletePattern: function() {
        var listBox = document.getElementById('webdavlinkOptionsList');
        listBox.removeItemAt(listBox.currentIndex);
        this.savePrefs();
    },

    toggleDebug: function() {
        this.savePrefs();
    },

    changeSelect: function() {
        this.enableDelete(true);
        var listBox = document.getElementById('webdavlinkOptionsList');
        var item = listBox.getItemAtIndex(listBox.currentIndex);
        var desc = item.getAttribute('label').split(/\s*=\s*/, 2);
        var ext = document.getElementById('webdavlinkOptionsPattern');
        var path = document.getElementById('webdavlinkOptionsApp');
        ext.value = desc[0];
        path.value = desc[1];
    }
};
