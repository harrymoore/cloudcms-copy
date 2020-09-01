#!/bin/sh

#
# Create package from exported content
#

. ./set-env.sh

npm install --no-audit

echo "*******************************"
echo "** create archive package file for import"
node ./package-content.js ./data $PACKAGE_GROUP $PACKAGE_ARTIFACT $PACKAGE_VERSION
