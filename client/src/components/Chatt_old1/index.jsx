import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import _ from "lodash";
import "./Chatt.css";

const Chatt = () => {
  const [displayName, setDisplayName] = useState();
  const [messages, setMesages] = useState([]);
  const [userName, setUserName] = useState();
  const [message, setMesage] = useState();

  useEffect(() => {
    setMesages([...messages, { displayName, message }]);
  }, [message]);

  const socket = io("http://localhost:3002", {
    transports: ["websocket", "polling", "flashsocket"]
  });

  if (socket.connected === true) {
    console.log(socket.connected);
  }

  console.log(messages);

  socket.on("chat message", msg => {
    setMesage(msg);
  });

  socket.on("user name", name => {
    setDisplayName(name);
  });

  const handleNickChange = e => {
    setUserName(e.target.value);
  };

  const handleSendMsg = e => {
    if (e.key === "Enter") {
      socket.emit("chat message", e.target.value);
      socket.emit("user name", userName);
      e.target.value = "";
    }
  };

  return (
    <div className="chatt-box">
      <label htmlFor="msg">NickName:</label>
      <input type="text" id="msg" onChange={handleNickChange} />
      <div className="message-box">
        {messages.length > 1 &&
          _.map(messages, obj => {
            return (
              <p>
                {obj.displayName}: {obj.message}
              </p>
            );
          })}
      </div>
      <input type="text" onKeyPress={handleSendMsg} />
    </div>
  );
};

export default Chatt;
