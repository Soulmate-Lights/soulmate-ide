const tailwindcss = require("tailwindcss");
const plugins = [];
plugins.push(tailwindcss("./tailwind.config.js"));
plugins.push(require("autoprefixer"));
module.exports = { plugins };
