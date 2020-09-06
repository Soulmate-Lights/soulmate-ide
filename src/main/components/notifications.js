import { TransitionGroup } from "react-transition-group";

import NotificationsContainer from "~/containers/notifications";

const Notifications = () => {
  const notificationsContainer = NotificationsContainer.useContainer();

  return (
    <TransitionGroup
      className="absolute z-50 top-10 right-10 space-y-4"
      classNames="example"
      timeout={{ enter: 500, exit: 300 }}
    >
      {notificationsContainer.notifications.map(({ text, type }) => (
        <div
          className={classnames("p-4 border rounded-md", {
            ["border-green-400 bg-green-50"]: type === "notice",
            ["border-red-400 bg-red-50"]: type === "error",
          })}
          key={text}
        >
          <p
            className={classnames("flex mx-3 text-sm font-medium leading-5", {
              ["text-green-800"]: type === "notice",
              ["text-red-800"]: type === "error",
            })}
          >
            {text}
          </p>
        </div>
      ))}
    </TransitionGroup>
  );
};

export default Notifications;
