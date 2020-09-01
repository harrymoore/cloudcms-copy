
# Copy content between Cloud CMS environments
Copy content items and their dependencies from a source Cloud CMS server/project to a target server/project

## Export from source
Use cloudcms-util (npm/npx script) to download from the source based on a query defined in a json file

## Package into an "archive" file
Use a local nodejs script and cloudcms-packager (npm module) to create a Cloud CMS "archive" file (zip for importing to Cloud CMS vault)

## Upload and import into a branch on the target environment
Use the cloudcms-cli (npm module installed as a "global" command line tool)

# Usage

## Setup
    1. Create gitana.json file from source project in this folder
    2. install cloudcms-cli
       - npm install -g cloudcms-cli
    3. add credentials to the target project for the cli
       1. copy cloudcms-login--template.sh to cloudcms-login.sh and set the credentials
    4. Create a JSON file containing a MongoDB query which will identify the content to be expored from the source
       1. and example is found in ./queries/test1.json
       2. copy the sample and write the query
    5. Set the query file name in ./export-content.sh
    6. Install npm dependencies for the packager
  `npm install`
    7.  


## Complete copy between environments:
sh ./copy-content.sh

## Export only:
sh ./export-content.sh

## Package only:
sh ./package-content.sh

## Upload and Import only:
sh ./import-content.sh
