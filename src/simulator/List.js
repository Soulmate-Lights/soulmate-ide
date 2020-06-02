import React from 'react';
import { FaRegLightbulb, FaLightbulb } from 'react-icons/fa';
import { token } from "./utils";
import { RiDeleteBin2Line, RiLogoutCircleRLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import "./List.css"
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useRef } from 'react';

export default ({ sketches, soulmates, selectedSketch, loggedIn, add, destroy }) => {
  const form = useRef();


  return (<div className="list">
    {sketches.map((sketch) => {
      const selected = sketch.id === selectedSketch.id;
      const name = sketch.name || "Untitled";
      return (
        <Link to={`/${sketch.id}`} key={sketch.id} className={`sketch ${selected && "selected"}`}>
          <div className="video-wrapper">
            <video src={sketch.video_url} autoPlay muted loop></video>
          </div>
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

    {soulmates?.map(soulmate => (
      <div className="device" key={soulmate.name}>
        {soulmate.name === 'iMac' ? <FaRegLightbulb /> : <FaLightbulb />}
        {soulmate.name}
      </div>
    ))}

    {!loggedIn && (
      <form action="/auth/auth0" method="post" ref={form}>
        <input type="hidden" name="authenticity_token" value={token()} />
        <div onClick={() => {
          form.current.submit()
        }} className="new button">Log in to create a sketch</div>
      </form>
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
}
