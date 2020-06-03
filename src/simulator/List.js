import React from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaRegLightbulb, FaLightbulb } from "react-icons/fa";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { token } from "./utils";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import "./List.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAuth0 } from "../react-auth0-spa";
import Logo from "./logo.svg";

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
        {!sketches && <Logo className="loader" />}

        {sketches?.map((sketch) => {
          const selected = sketch.id === selectedSketch.id;
          const name = sketch.name || "Untitled";
          return (
            <Link
              to={`/${sketch.id}`}
              key={sketch.id}
              className={`sketch ${selected && "selected"}`}
            >
              <div className="video-wrapper">
                <video muted loop>
                  <source
                    id="media-source"
                    src={`${sketch.video_url}#t=2`}
                    type="video/mp4"
                  />
                </video>
              </div>
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
        <div className="shadow"></div>
      </div>

      {userDetails && sketches && (
        <div className="new button" onClick={add}>
          <AiOutlinePlusCircle />
          New sketch
        </div>
      )}

      <div className="soulmates">
        {soulmates.length > 0 && (
          <>
            <p className="heading">Soulmates</p>

            {soulmates.map((s) => {
              const connected = s === soulmate;
              return (
                <div
                  className={`device ${connected ? "connected" : ""}`}
                  key={s.name}
                  onClick={() => {
                    setSoulmate(connected ? false : s);
                  }}
                >
                  {s === soulmate ? <FiCheckCircle /> : <FiCircle />}
                  {s.name}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* {userDetails.name ? (
        <div className="user">
          <img src={userDetails?.picture} />
          {userDetails?.name}
          <a className="logout" onClick={logout}>
            Log out
          </a>
        </div>
      ) : (
        <div onClick={login} className="new button">
          <MdAccountCircle />
          Log in
        </div>
      )} */}
    </div>
  );
};
