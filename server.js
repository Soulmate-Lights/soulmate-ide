const fs = require("fs");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const EDGE_URL = process.env.EDGE_URL || "";

let html;
if (fs.existsSync("./build/_index.html")) {
  html = fs.readFileSync("./build/_index.html").toString();
} else {
  html = fs.readFileSync("./build/index.html").toString();
}

html = html.replaceAll("/src", `${EDGE_URL}/src`);

express()
  .use(
    require("prerender-node").set("prerenderToken", process.env.PRERENDER_TOKEN)
  )
  .use(express.static(path.join(__dirname, "build")))
  .get("/(*)", (req, res) => res.send(html))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
