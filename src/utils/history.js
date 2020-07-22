import isElectron from "~/utils/isElectron";

import { createHashHistory, createBrowserHistory } from "history";

let history;
if (isElectron()) {
  history = createHashHistory();
} else {
  history = createBrowserHistory();
}

export default history;
