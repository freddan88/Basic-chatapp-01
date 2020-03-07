import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import _ from "lodash";
import "./Chatt.css";

const socket = io("http://localhost:3002", {
  transports: ["websocket", "polling", "flashsocket"]
});

const Chatt = () => {
  const [userName, setUserName] = useState();
  const [sessionID, setSessionID] = useState();
  const [messages, setMessages] = useState([]);
  const messageBox = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      const session = socket.id;
      setSessionID(session);
    });
  }, []);

  socket.on("chat message", message => {
    setMessages([...messages, message]);
    const lastMessage = messageBox.current.lastElementChild;
    lastMessage.scrollIntoView({
      behavior: "smooth"
    });
  });

  const handleUsername = e => {
    setUserName(e.target.value);
  };

  const handleMessage = e => {
    if (e.key === "Enter") {
      const message = e.target.value;
      let userName = e.target.dataset.user;
      if (_.isEmpty(userName)) {
        userName = sessionID;
      }
      socket.emit("chat message", { userName, message });
      e.target.value = "";
    }
  };

  return (
    <div className="chatt-box">
      <label htmlFor="nick">Username:</label>
      <input type="text" id="nick" onChange={handleUsername} />
      <div className="message-box" ref={messageBox}>
        {_.map(messages, (obj, index) => {
          return (
            <p key={index}>
              {obj.userName}: {obj.message}
            </p>
          );
        })}
      </div>
      <input type="text" data-user={userName} onKeyPress={handleMessage} />
    </div>
  );
};

export default Chatt;
