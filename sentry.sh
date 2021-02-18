#!/bin/bash

VERSION=$(node ./get-version.js)
echo "[Sentry] Uploading sourcemaps for version: $VERSION"
sentry-cli releases new $VERSION

yarn react-build

sentry-cli releases files $VERSION upload-sourcemaps dist --rewrite

# Finalize the release and mark it deployed
sentry-cli releases finalize $VERSION
sentry-cli releases deploys $VERSION new -e production
sentry-cli releases set-commits --auto $VERSION
