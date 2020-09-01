#!/bin/sh

#
# Export content from source cloud cms project
#

# set common environment
. ./set-env.sh

mkdir ./data
echo "*******************************"
echo "** Export content for packaging"
npx cloudcms-util export -g $SOURCE_GITANA_FILE --branch $SOURCE_BRANCH --folder-path ./data --traverse --query-file-path=$SOURCE_QUERY_FILE --include-related
