import Simulator from "../simulator/index.js";
import { hot } from "react-hot-loader";
import { Mode, useLightSwitch } from "use-light-switch";
import { useContainer } from "unstated-next";
import SketchesContainer from "../simulator/sketchesContainer";
import SelectionsContainer from "../simulator/selectionContainer";
import SoulmatesContainer from "../simulator/soulmatesContainer";
import UserContainer from "../simulator/userContainer.js";
import isElectron from "../simulator/utils/isElectron";
import { Router, HashRouter, Route, Switch } from "react-router-dom";
import history from "../utils/history";
import Titlebar from "./titlebar";

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
      <Titlebar userDetails={userDetails} login={login} logout={logout} />
      <div className="frame">
        <SpecificRouter history={history}>
          <Switch>
            <Route path="/auth">
              <div></div>
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
        </SpecificRouter>
      </div>
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
