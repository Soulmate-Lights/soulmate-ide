# Soulmate IDE

![Lint](https://github.com/Soulmate-Lights/soulmate-ide/workflows/Lint/badge.svg)
![Build/release](https://github.com/Soulmate-Lights/soulmate-ide/workflows/Build/release/badge.svg)

## A desktop IDE for Soulmate.

### Dev environment

`$ foreman start`

This command runs four processes (Procfile)

```
ide: yarn; LOCAL=true yarn start
server: cd services/soulmate-server && bundle install --quiet && PORT=3001 bundle exec rails s -p3001
firmware: cd services/soulmate-builder-server && yarn --quiet && PORT=8081 yarn start
emulator: cd services/wokwi-server && yarn --quiet && PORT=8080 yarn start
```

- IDE: The local IDE electron app
- server: The Rails app that stores patterns
- firmware: Firmware builder server 
- emulator: Wokwi-based arduino emulator hex builder

This is the best way to run the whole ecosystem at once. You won't get any previews or thumbnails of your local patterns, but that's on the list of things to do. Changes you make to the firmware (soulmate-builder-server/soulmate-core) will be used the next time you flash.

Recursively commit and push everything by running

`./commit-all.sh "Commit all repos at once"`
