import { createContainer } from "~/utils/unstated-next";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(notifications);

  function notify(text, type = "notice") {
    setNotifications([...notifications, { text, type }]);

    setTimeout(() => {
      setNotifications(notificationsRef.current.filter((t) => t.text !== text));
    }, 2000);
  }

  return { notify, notifications };
}

export default createContainer(Notifications);
