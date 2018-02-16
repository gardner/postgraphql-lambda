#!/bin/bash

npm version patch

APP_VERSION=$(node -p 'require("./package.json").version')

echo -n $APP_VERSION.$(git rev-parse --short HEAD) > .version

rm -f graphql.zip

# Reduce the file size by removing map files
# find node_modules -name \*.map -exec rm "{}" \;

zip -q9r graphql.zip index.js node_modules

ls -lah graphql.zip | awk '{ print $5 }'
