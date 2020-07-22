import { GoDesktopDownload } from "react-icons/go";
import isElectron from "../simulator/utils/isElectron";

const Titlebar = ({ userDetails, login, logout }) => (
  <div className="titlebar">
    <span className="title">Soulmate</span>
    <div className="user">
      {userDetails?.name ? (
        <>
          <img src={userDetails?.picture} />
          {userDetails?.name}
          <a className="logout button" onClick={logout}>
            Log out
          </a>
        </>
      ) : (
        <div onClick={login} className="new button">
          Log in
        </div>
      )}
      {!isElectron() && (
        <a className="button" href="/download">
          <GoDesktopDownload style={{ fill: "inherit" }} />
          Download the app
        </a>
      )}
    </div>
  </div>
);

export default Titlebar;
