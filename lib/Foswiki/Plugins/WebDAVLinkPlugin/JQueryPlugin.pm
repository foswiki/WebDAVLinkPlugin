# See bottom of file for license and copyright details

package Foswiki::Plugins::WebDAVLinkPlugin::JQueryPlugin;

use strict;
use base 'Foswiki::Plugins::JQueryPlugin::Plugin';
use Assert;

our $VERSION = '1.7.0';

sub new {
    my $class = shift;
    my $session = shift || $Foswiki::Plugins::SESSION;

    my $this = bless(
        $class->SUPER::new(
            $session,
            name       => 'webdavlink',
            version    => '1.1',
            author     => 'Crawford Currie',
            homepage   => '',
            puburl     => '%PUBURLPATH%/%SYSTEMWEB%/WebDAVLinkPlugin',
            javascript => ["webdavlink.js"],
            css        => ["webdavlink.css"],
        ),
        $class
    );

    $this->{summary} = <<'HERE';
Plugin supports the opening of Web DAV hosted documents in associated
native applications.
HERE

    return $this;
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
