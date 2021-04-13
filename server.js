const fs = require("fs");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const EDGE_URL = process.env.EDGE_URL || "";
const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN;

let html = fs.readFileSync("./dist/index.html").toString();
html = html.replaceAll("/src", `${EDGE_URL}/src`);

express()
  .use(require("prerender-node").set("prerenderToken", PRERENDER_TOKEN))
  .use(express.static(path.join(__dirname, "build")))
  .get("/(*)", (req, res) => res.send(html))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
