import "regenerator-runtime/runtime";
import "../tailwind.config";
import "./monaco";

import { RewriteFrames } from "@sentry/integrations";
import * as SentryReact from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from "react";
import ReactDOM from "react-dom";
import ReactGA from 'react-ga';
import { hot } from "react-hot-loader";

import isDev from "~/utils/isDev";

import Main from "./main";

require("@tailwindcss/ui");
require("./index.pcss");

ReactGA.initialize('UA-131034779-4', {
  gaOptions: {
    siteSpeedOptions: 100
  }
});
ReactGA.pageview(window.location.pathname + window.location.search);

SentryReact.init({
  dsn:
    !isDev() &&
    "https://d71092cee93f41a1a5c02404ad236f82@o141622.ingest.sentry.io/5433159",
  integrations: [new Integrations.BrowserTracing(), new RewriteFrames()],
  release: require("../package.json").version,
  environment: isDev() ? "development" : "production",
});

if (isDev()) console.log("Running development environment");

const HotMain = hot(module)((params) => <Main {...params} />);
ReactDOM.render(<HotMain />, document.getElementById("root"));
module.hot?.accept();
