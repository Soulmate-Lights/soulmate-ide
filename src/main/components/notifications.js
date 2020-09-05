import { CSSTransitionGroup } from "react-transition-group";

import NotificationsContainer from "~/containers/notifications";

const Notifications = () => {
  const notificationsContainer = NotificationsContainer.useContainer();
  return (
    <CSSTransitionGroup
      className="absolute z-50 top-10 right-10 space-y-4"
      transitionName="toast"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      {notificationsContainer.notifications.map((notification) => (
        <div
          className="p-4 border border-green-400 rounded-md bg-green-50"
          key={notification}
        >
          <p className="flex mx-3 text-sm font-medium text-green-800 leading-5">
            {notification}
          </p>
        </div>
      ))}
    </CSSTransitionGroup>
  );
};

export default Notifications;
