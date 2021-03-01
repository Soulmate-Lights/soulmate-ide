echo "Committing soulmate-core..."
(cd services/soulmate-builder-server/soulmate-core && git commit -am "$1" && git push)
echo "Committing soulmate-builder-server..."
(cd services/soulmate-builder-server && git commit -am "$1" && git push)
echo "Committing soulmate-server..."
(cd services/soulmate-server && git commit -am "$1" && git push)
echo "Committing wokwi-server..."
(cd services/wokwi-server && git commit -am "$1" && git push)
echo "Committing IDE..."
git commit -am "$1" && git push
