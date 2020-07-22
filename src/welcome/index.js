import "./style.css";

import { Link } from "react-router-dom";
import Logo from "../simulator/logo.svg";
import SketchesContainer from "~/containers/sketchesContainer";
import UserContainer from "~/containers/userContainer";
import { useContainer } from "unstated-next";

const Welcome = () => {
  const { createSketch } = useContainer(SketchesContainer);
  const { userDetails, login } = useContainer(UserContainer);

  const add = async () => {
    const newSketch = await createSketch("My new sketch");
    history.push(`/${newSketch.id}`);
  };

  return (
    <div className="welcome">
      <Logo />
      <h1>Soulmate </h1>
      <p className="get-started">
        <Link to="/" className="button">
          Editor
        </Link>
        {userDetails ? (
          <Link onClick={add} className="button">
            New pattern
          </Link>
        ) : (
          <Link onClick={login} className="button">
            Log in
          </Link>
        )}
        <Link disabled className="button">
          Tutorial
        </Link>
      </p>
    </div>
  );
};

export default Welcome;
