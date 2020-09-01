#!/bin/sh

#
# Import Category/Sub-Category and Keyword default items
#

# set common environment
. ./set-env.sh

echo "*******************************"
echo "** Import content to target environment"
npx cloudcms-util import -g $TARGET_GITANA_FILE --branch $TARGET_BRANCH --folder-path ./data --nodes --include-related
# npx cloudcms-util import -g $TARGET_GITANA_FILE --branch $TARGET_BRANCH --folder-path ./content-model --all-definitions -v
