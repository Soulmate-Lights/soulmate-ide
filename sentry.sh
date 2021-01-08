#!/bin/bash

VERSION=$(node ./get-version.js)
echo "[Sentry] Uploading sourcemaps for version: $VERSION"
npx sentry-cli releases new $VERSION

yarn --ignore-scripts

npx parcel build index.html

npx sentry-cli releases files $VERSION upload-sourcemaps dist --rewrite

# Finalize the release and mark it deployed
npx sentry-cli releases finalize $VERSION
npx sentry-cli releases deploys $VERSION new -e production
npx sentry-cli releases set-commits --auto $VERSION
