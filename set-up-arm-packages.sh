(cd .. && git clone -b Feature/AppleSiliconARM64 https://github.com/mmaietta/electron-builder.git)
(cd ../electron-builder && yarn)
(cd ../electron-builder && yarn compile)
(cd ../electron-builder/packages/app-builder-lib && yalc push)
(cd ../electron-builder/packages/builder-util && yalc push)
(cd ../electron-builder/packages/builder-util-runtime && yalc push)
(cd ../electron-builder/packages/dmg-builder && yalc push)
(cd ../electron-builder/packages/electron-builder && yalc push)
(cd ../electron-builder/packages/electron-publish && yalc push)
(cd ../electron-builder/packages/electron-builder-squirrel-windows && yalc push)
(cd ../electron-builder/packages/electron-forge-maker-appimage && yalc push)
(cd ../electron-builder/packages/electron-forge-maker-nsis && yalc push)
(cd ../electron-builder/packages/electron-forge-maker-nsis-web && yalc push)
(cd ../electron-builder/packages/electron-forge-maker-snap && yalc push)
(cd ../electron-builder/packages/electron-updater && yalc push)


rm -rf dist
yarn electron-builder --arm64 --x64
