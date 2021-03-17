import React from "react";

import isDev from "~/utils/isDev";

function createContainer(useHook) {
  var Context = React.createContext(null);

  function Provider(props) {
    var value = useHook(props.initialState);

    if (isDev()) {
      if (!React.__containerCache) React.__containerCache = {};
      React.__containerCache[useHook.name] = value;
    }

    return React.createElement(
      Context.Provider,
      { value: value },
      props.children
    );
  }

  function useContainer() {
    var value = React.useContext(Context);

    if (!value && isDev()) {
      value = React.__containerCache[useHook.name];
    }

    if (value === null || value === undefined) {
      throw new Error("Component must be wrapped with <Container.Provider>");
    }

    return value;
  }

  return {
    Provider: Provider,
    useContainer: useContainer,
  };
}
function useContainer(container) {
  return container.useContainer();
}

export { createContainer, useContainer };
//# sourceMappingURL=unstated-next.mjs.map
