#!/usr/bin/perl -w
BEGIN { unshift @INC, split( /:/, $ENV{FOSWIKI_LIBS} ); }
use Foswiki::Contrib::Build;

# Create the build object
$build = new Foswiki::Contrib::Build('WebDAVLinkPlugin');

# Lazy, assume Linux
print `(cd ../../../../pub/System/WebDAVLinkPlugin/firefox/ && sh build.sh)`;

# Build the target on the command line, or the default target
$build->build( $build->{target} );
