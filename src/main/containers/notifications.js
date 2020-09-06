import { createContainer } from "unstated-next";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(notifications);

  function notify(text, type = "notice") {
    setNotifications([...notifications, { text, type }]);

    setTimeout(() => {
      const newNotifications = notificationsRef.current.filter(
        (t) => t.text !== text
      );
      setNotifications(newNotifications);
    }, 2000);
  }

  return { notify, notifications };
}

export default createContainer(Notifications);
