import React from "react";
import { FaRegLightbulb, FaLightbulb } from "react-icons/fa";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { token } from "./utils";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import "./List.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAuth0 } from "../react-auth0-spa";

export default ({
  sketches,
  soulmates,
  soulmate,
  setSoulmate,
  selectedSketch,
  add,
  destroy,
  userDetails,
  logout,
  login,
}) => {
  return (
    <div className="list">
      <p className="heading">Sketches</p>
      <div className="sketches">
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
              {userDetails && (
                <RiDeleteBin2Line
                  className="delete"
                  onClick={() => destroy(sketch.id)}
                />
              )}
            </Link>
          );
        })}
      </div>

      {userDetails && (
        <div className="new button" onClick={add}>
          <AiOutlinePlusCircle />
          New sketch
        </div>
      )}

      {soulmates.length > 0 && (
        <div className="soulmates">
          <p className="heading">Soulmates</p>

          {soulmates.map((s) => (
            <div
              className={`device ${s === soulmate ? "connected" : ""}`}
              key={s.name}
              onClick={() => setSoulmate(s)}
            >
              {s === soulmate ? <FiCheckCircle /> : <FiCircle />}
              {s.name}
            </div>
          ))}
        </div>
      )}

      {userDetails.name ? (
        <div className="user">
          <img src={userDetails?.picture} />
          {userDetails?.name}
          <a className="logout" onClick={logout}>
            Log out
          </a>
        </div>
      ) : (
        <div onClick={login} className="new button">
          Log in to create a sketch
        </div>
      )}
    </div>
  );
};
