# Soulmate IDE

![Lint](https://github.com/Soulmate-Lights/soulmate-ide/workflows/Lint/badge.svg)
![Build/release](https://github.com/Soulmate-Lights/soulmate-ide/workflows/Build/release/badge.svg)

## A desktop IDE for Soulmate.

### Dev environment

`$ yarn start`

###

Don't forget to update the editor.worker.js file. Right now it's bundled in with the app. Something tricky with URLs.

cp node_modules/monaco-editor/esm/vs/editor/editor.worker.js src/editor.worker.js
