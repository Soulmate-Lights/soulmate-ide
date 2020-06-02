import React from "react";
import { FaRegLightbulb, FaLightbulb } from "react-icons/fa";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { token } from "./utils";
import { RiDeleteBin2Line, RiLogoutCircleRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./List.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useRef } from "react";

import { useAuth0 } from "../react-auth0-spa";

export default ({
  sketches,
  soulmates,
  soulmate,
  setSoulmate,
  selectedSketch,
  loggedIn,
  add,
  destroy,
}) => {
  const form = useRef();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="list">
      {JSON.stringify(user)}
      {sketches.map((sketch) => {
        const selected = sketch.id === selectedSketch.id;
        const name = sketch.name || "Untitled";
        return (
          <Link
            to={`/${sketch.id}`}
            key={sketch.id}
            className={`sketch ${selected && "selected"}`}
          >
            {/* <div className="video-wrapper">
            <video src={sketch.video_url} autoPlay muted loop></video>
          </div> */}
            {name.slice(0, 20)}
            {loggedIn && (
              <RiDeleteBin2Line
                className="delete"
                onClick={() => destroy(sketch.id)}
              />
            )}
          </Link>
        );
      })}

      {soulmates?.map((s) => (
        <div
          className={`device ${s === soulmate ? "connected" : ""}`}
          key={s.name}
          onClick={() => setSoulmate(s)}
        >
          {s === soulmate ? <FiCheckCircle /> : <FiCircle />}
          {s.name}
        </div>
      ))}

      {!loggedIn && (
        // <form
        //   action="https://editor.soulmatelights.com/auth/auth0"
        //   method="post"
        //   ref={form}
        //   target="_blank"
        // >
        //   <input type="hidden" name="authenticity_token" value={token()} />
        <div
          onClick={() => {
            // form.current.submit();
            loginWithRedirect();
          }}
          className="new button"
        >
          Log in to create a sketch
        </div>
        // </form>
      )}
      {loggedIn && (
        <React.Fragment>
          <div className="new button" onClick={add}>
            <AiOutlinePlusCircle />
            New sketch
          </div>
          <a className="logout button" href="/logout">
            <RiLogoutCircleRLine />
            Log out
          </a>
        </React.Fragment>
      )}
    </div>
  );
};
