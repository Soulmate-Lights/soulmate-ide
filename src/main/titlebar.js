import { AiOutlineHome } from "react-icons/ai";
import { GoDesktopDownload } from "react-icons/go";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import isElectron from "~/utils/isElectron";

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
          <MdAccountCircle />
          Log in
        </div>
      )}
      <Link to="/welcome" className="button">
        <AiOutlineHome /> Home
      </Link>
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
