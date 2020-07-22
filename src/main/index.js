import { HashRouter, Route, Router, Switch } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";

import SelectionsContainer from "~/containers/selectionContainer";
import Simulator from "../simulator";
import SketchesContainer from "~/containers/sketchesContainer";
import SoulmatesContainer from "~/containers/soulmatesContainer";
import Titlebar from "./titlebar";
import UserContainer from "~/containers/userContainer";
import Welcome from "../welcome";
import history from "../utils/history";
import { hot } from "react-hot-loader";
import isElectron from "../simulator/utils/isElectron";
import { useContainer } from "unstated-next";

const SpecificRouter = isElectron() ? HashRouter : Router;

const Main = () => {
  useEffect(() => {
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, []);

  const [focus, setFocus] = useState(true);
  const { userDetails, login, logout } = useContainer(UserContainer);

  const mode = useLightSwitch();
  const appClass = `
    ${mode === Mode.Dark && "dark"}
    ${focus ? "focus" : "blur"}`;

  return (
    <div className={`app-wrapper ${appClass}`}>
      <SpecificRouter history={history}>
        <Titlebar userDetails={userDetails} login={login} logout={logout} />
        <div className="frame">
          <Switch>
            <Route path="/auth">
              <div></div>
            </Route>

            <Route exact path="/welcome">
              <Welcome />
            </Route>

            <Route
              path="/:id?"
              render={({
                match: {
                  params: { id },
                },
              }) => <Simulator id={parseInt(id)} />}
            />
          </Switch>
        </div>
      </SpecificRouter>
    </div>
  );
};

const HotMain = hot(module)((params) => (
  <SelectionsContainer.Provider>
    <SketchesContainer.Provider>
      <UserContainer.Provider>
        <SoulmatesContainer.Provider>
          <Main {...params} />
        </SoulmatesContainer.Provider>
      </UserContainer.Provider>
    </SketchesContainer.Provider>
  </SelectionsContainer.Provider>
));

export default HotMain;
