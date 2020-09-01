#!/bin/sh

#
#
# export, package, import 
#

echo "*******************************"
echo "** Copy"
mkdir ./data
rm -rf ./data
mkdir ./data

sh ./export-content.sh
sh ./import-content.sh


