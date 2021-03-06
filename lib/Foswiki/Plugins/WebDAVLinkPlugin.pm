# See bottom of file for license and copyright details

package Foswiki::Plugins::WebDAVLinkPlugin;

use strict;
use Assert;

use JSON ();

use Foswiki       ();
use Foswiki::Func ();

# If you update the version number don't forget to update the version of the
# Firefox extension in pub/System/WebDAVLinkPlugin/firefox/install.rdf
our $VERSION = '1.7';
our $RELEASE = '11 Nov 2016';
our $SHORTDESCRIPTION =
  'Automatically open links to !WebDAV resources in local applications';
our $NO_PREFS_IN_TOPIC = 1;

sub initPlugin {
    my ( $topic, $web, $user, $installWeb ) = @_;

    Foswiki::Func::registerTagHandler( 'WEBDAVFOLDERURL', \&_WEBDAVFOLDERURL );

    my $webdav_urls = $Foswiki::cfg{Plugins}{WebDAVLinkPlugin}{URLs};
    if ($webdav_urls) {
        $webdav_urls = Foswiki::urlEncode($webdav_urls);
        my $usejqp = 0;

        if ( eval "use Foswiki::Plugins::JQueryPlugin; 1;"
            && defined &Foswiki::Plugins::JQueryPlugin::registerPlugin )
        {

            # Register our jQuery plugin
            Foswiki::Plugins::JQueryPlugin::registerPlugin( 'webdavlink',
                'Foswiki::Plugins::WebDAVLinkPlugin::JQueryPlugin' );
            $usejqp = 1;
        }

        my $ms_apps = Foswiki::urlEncode(
            JSON::to_json(
                $Foswiki::cfg{Plugins}{WebDAVLinkPlugin}{MSApps} || ''
            )
        );

        # utf8::downgrade($zone) if utf8::is_utf8($zone); # see Item9130
        Foswiki::Func::addToHEAD( 'WEBDAVLINKPLUGIN', <<STUFF );
<meta name="WEBDAVLINK_URLS" content="$webdav_urls" />
<meta name="WEBDAVLINK_MSAPPS" content="$ms_apps" />
STUFF

        # Create the plugin so we get the JS added to the header of
        # whatever page we are viewing.
        if ($usejqp) {
            Foswiki::Plugins::JQueryPlugin::createPlugin('cookie');
            Foswiki::Plugins::JQueryPlugin::createPlugin('webdavlink');
        }
        else {

            # ASSUME THIS IS TWIKI!! Don't rely on the JQueryPlugin
            Foswiki::Func::addToHEAD( 'WEBDAVLINKPLUGIN_JS',
                <<STUFF, "JQUERYPLUGIN" );
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/WebDAVLinkPlugin/jquery-1.1.3.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/WebDAVLinkPlugin/jquery.livequery-1.0.3.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/WebDAVLinkPlugin/webdavlink.uncompressed.js"></script>
<link media="all" type="text/css" href="%PUBURLPATH%/%SYSTEMWEB%/WebDAVLinkPlugin/webdavlink.uncompressed.css?version=1.1" rel="stylesheet"/>
STUFF
        }
    }
    else {
        die "{Plugins}{WebDAVLinkPlugin}{URLs} must be defined and non-empty";
    }
    return 1;
}

sub _WEBDAVFOLDERURL {
    my @webdav_urls =
      split( /\|/, $Foswiki::cfg{Plugins}{WebDAVLinkPlugin}{URLs} );
    $webdav_urls[0] =~ s/\/*$//;    #remove trailing slash
    return $webdav_urls[0];
}

1;
__END__

Copyright (C) 2009-2015 WikiRing http://wikiring.com

This program is licensed to you under the terms of the GNU General
Public License, version 2. It is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.

Author: Crawford Currie http://c-dot.co.uk
