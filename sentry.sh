#!/bin/bash

VERSION=$(node ./get-version.js)
echo "[Sentry] Uploading sourcemaps for version: $VERSION"
npx sentry-cli releases new $VERSION

npx parcel build src/index.html

npx sentry-cli releases files $VERSION upload-sourcemaps dist --rewrite

# Finalize the release and mark it deployed
npx sentry-cli releases finalize $VERSION
npx sentry-cli releases deploys $VERSION new -e prod
npx sentry-cli releases set-commits --auto $VERSION
