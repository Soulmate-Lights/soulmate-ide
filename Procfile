web: node index.js
ide: yarn; LOCAL=true yarn start
server: cd services/soulmate-server && bundle install --quiet && PORT=3001 bundle exec rails s -p3001
firmware: cd services/soulmate-builder-server && yarn --quiet && PORT=8081 yarn start
emulator: cd services/wokwi-server && yarn --quiet && PORT=8080 yarn start
