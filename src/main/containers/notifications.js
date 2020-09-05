import { createContainer } from "unstated-next";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(notifications);

  function notify(text) {
    setNotifications([...notifications, text]);

    setTimeout(() => {
      const newNotifications = notificationsRef.current.filter(
        (t) => t !== text
      );
      setNotifications(newNotifications);
    }, 2000);
  }

  return { notify, notifications };
}

export default createContainer(Notifications);
