import { createBrowserHistory, createMemoryHistory } from "history";

import isElectron from "~/utils/isElectron";

let history;
if (isElectron()) {
  history = createMemoryHistory();
} else {
  history = createBrowserHistory();
}

export default history;
