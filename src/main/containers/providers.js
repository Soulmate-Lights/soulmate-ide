import BuildsContainer from "~/containers/builds";
import NetworkContainer from "~/containers/network";
import NotificationsContainer from "~/containers/notifications";
import SoulmatesContainer from "~/containers/soulmates";

export const IDEProvider = ({ children }) => (
  <NetworkContainer.Provider>
    <NotificationsContainer.Provider>
      <SoulmatesContainer.Provider>
        <BuildsContainer.Provider>{children}</BuildsContainer.Provider>
      </SoulmatesContainer.Provider>
    </NotificationsContainer.Provider>
  </NetworkContainer.Provider>
);
