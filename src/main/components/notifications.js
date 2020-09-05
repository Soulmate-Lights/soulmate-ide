import { CSSTransitionGroup } from "react-transition-group";

import NotificationsContainer from "~/containers/notifications";

const Notifications = () => {
  const notificationsContainer = NotificationsContainer.useContainer();
  return (
    <CSSTransitionGroup
      className="absolute top-10 right-10 z-50 space-y-4"
      transitionName="toast"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      {notificationsContainer.notifications.map((notification) => (
        <div
          className="rounded-md bg-green-50 border border-green-400 p-4"
          key={notification}
        >
          <p className="flex mx-3 text-sm leading-5 font-medium text-green-800">
            {notification}
          </p>
        </div>
      ))}
    </CSSTransitionGroup>
  );
};

export default Notifications;
