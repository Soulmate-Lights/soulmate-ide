cd ../electron-builder

yarn compile && \
(cd ./packages/app-builder-lib && yalc push) && \
(cd ./packages/builder-util && yalc push) && \
(cd ./packages/builder-util-runtime && yalc push) && \
(cd ./packages/dmg-builder && yalc push) && \
(cd ./packages/electron-builder && yalc push) && \
(cd ./packages/electron-publish && yalc push) && \
(cd ./packages/electron-builder-squirrel-windows && yalc push) && \
(cd ./packages/electron-forge-maker-appimage && yalc push) && \
(cd ./packages/electron-forge-maker-nsis && yalc push) && \
(cd ./packages/electron-forge-maker-nsis-web && yalc push) && \
(cd ./packages/electron-forge-maker-snap && yalc push) && \
(cd ./packages/electron-updater && yalc push) \
&& ( cd ../soulmate-ide && rm -rf dist && yarn electron-builder --arm64 --x64 )
