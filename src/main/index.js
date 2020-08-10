import { HashRouter, Route, Router, Switch } from "react-router-dom";

import Dashboard from "./dashboard";
import Editor from "./editor";
import Gallery from "./gallery";
import Flash from "./flash";
import MySketches from "./mySketches";
import Menu from "./menu";
import SelectionsContainer from "./containers/selection";
import BuildsContainer from "./containers/builds";
import SketchesContainer from "./containers/sketches";
import SoulmatesContainer from "./containers/soulmates";
import UserContainer from "./containers/user";
import UserDetails from "./userDetails";
import Welcome from "./welcome";
import history from "~/utils/history";
import { hot } from "react-hot-loader";
import isElectron from "~/utils/isElectron";

const SpecificRouter = isElectron() ? HashRouter : Router;

const Main = () => {
  return (
    <SpecificRouter history={history}>
      <div
        className="h-screen flex overflow-hidden bg-gray-100"
        style={{ webkitUserSelect: "none" }}
      >
        <div
          className="absolute w-full h-5"
          style={{ WebkitAppRegion: "drag" }}
        />

        <div className="flex flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-gray-800">
              <Menu />
              <UserDetails />
            </div>
          </div>
        </div>

        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/tutorial">
            <Welcome />
          </Route>
          <Route exact path="/my-patterns">
            <MySketches />
          </Route>
          <Route
            path="/my-patterns/:id"
            render={({
              match: {
                params: { id },
              },
            }) => <Editor id={id} mine />}
          />
          <Route exact path="/gallery">
            <Gallery />
          </Route>
          <Route exact path="/flash">
            <Flash />
          </Route>
          <Route
            path="/gallery/:id"
            render={({
              match: {
                params: { id },
              },
            }) => <Editor id={id} />}
          />
        </Switch>
      </div>
    </SpecificRouter>
  );
};

const HotMain = hot(module)((params) => <Main {...params} />);

const WrappedHotMain = (params) => (
  <SelectionsContainer.Provider>
    <BuildsContainer.Provider>
      <SketchesContainer.Provider>
        <UserContainer.Provider>
          <SoulmatesContainer.Provider>
            <HotMain {...params} />
          </SoulmatesContainer.Provider>
        </UserContainer.Provider>
      </SketchesContainer.Provider>
    </BuildsContainer.Provider>
  </SelectionsContainer.Provider>
);

export default WrappedHotMain;
