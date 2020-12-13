#!/bin/bash

case $(arch) in
  arm64)
    echo "installing for arm64"
    yarn run electron-builder install-app-deps --arch arm64
    ;;

  *)
    echo "installing for x86-64"
    yarn run electron-builder install-app-deps
    ;;
esac

electron-rebuild .
