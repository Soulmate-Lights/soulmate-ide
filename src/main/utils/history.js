import { createBrowserHistory,createHashHistory } from "history";

import isElectron from "~/utils/isElectron";

let history;
if (isElectron()) {
  history = createHashHistory();
} else {
  history = createBrowserHistory();
}

export default history;
