import { HashRouter, Redirect, Route, Router, Switch } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";

import SelectionsContainer from "~/containers/selectionContainer";
import Simulator from "../simulator";
import SketchesContainer from "~/containers/sketchesContainer";
import SoulmatesContainer from "~/containers/soulmatesContainer";
import Titlebar from "./titlebar";
import UserContainer from "~/containers/userContainer";
import Welcome from "../welcome";
import classnames from "classnames";
import history from "~/utils/history";
import { hot } from "react-hot-loader";
import isElectron from "~/utils/isElectron";
import { useContainer } from "unstated-next";

const SpecificRouter = isElectron() ? HashRouter : Router;

const Main = () => {
  useEffect(() => {
    console.log(window.ipcRenderer);
    if (window.ipcRenderer) {
      window.ipcRenderer.on("focus", (event, isFocused) => setFocus(isFocused));
    }
  }, []);

  const [focus, setFocus] = useState(true);
  const { userDetails, login, logout } = useContainer(UserContainer);
  const blur = !focus;
  const dark = useLightSwitch() === Mode.Dark;

  return (
    <div className={classnames("app-wrapper", { dark, focus, blur })}>
      <SpecificRouter history={history}>
        <Titlebar userDetails={userDetails} login={login} logout={logout} />
        <div className="frame">
          <Switch>
            <Route path="/auth">
              <div />
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
              }) => (
                <>
                  {!userDetails && <Redirect to="/welcome" />}
                  <Simulator id={parseInt(id)} />
                </>
              )}
            />
          </Switch>
        </div>
      </SpecificRouter>
    </div>
  );
};

const HotMain = hot(module)((params) => <Main {...params} />);

const Wrap = (params) => (
  <SelectionsContainer.Provider>
    <SketchesContainer.Provider>
      <UserContainer.Provider>
        <SoulmatesContainer.Provider>
          <HotMain {...params} />
        </SoulmatesContainer.Provider>
      </UserContainer.Provider>
    </SketchesContainer.Provider>
  </SelectionsContainer.Provider>
);

export default Wrap;
