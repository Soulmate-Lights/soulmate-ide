import { HashRouter, Redirect, Route, Router, Switch } from "react-router-dom";

import Dashboard from "./dashboard";
import Editor from "./editor";
import Gallery from "./gallery";
import Menu from "./menu";
import SelectionsContainer from "~/containers/selectionContainer";
import SketchesContainer from "~/containers/sketchesContainer";
import SoulmatesContainer from "~/containers/soulmatesContainer";
import UserContainer from "~/containers/userContainer";
import UserDetails from "./userDetails";
import Welcome from "../welcome";
import history from "~/utils/history";
import { hot } from "react-hot-loader";
import isElectron from "~/utils/isElectron";

const SpecificRouter = isElectron() ? HashRouter : Router;

const Main = () => {
  return (
    <SpecificRouter history={history}>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <div
          className="absolute w-full h-8"
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
          <Route path="/my-patterns/:id?">
            <Gallery mine />
          </Route>
          <Route
            path="/gallery/:id"
            render={({
              match: {
                params: { id },
              },
            }) => <Editor id={id} />}
          />
          <Route exact path="/gallery">
            <Gallery />
          </Route>
        </Switch>
      </div>
    </SpecificRouter>
  );
};

const HotMain = hot(module)((params) => <Main {...params} />);

const WrappedHotMain = (params) => (
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

export default WrappedHotMain;
