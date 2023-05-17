import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import {useLocation} from 'react-router-dom'

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

const ENDPOINT = 'https://chat-application-server-wi0w.onrender.com';

let socket;

const Chat = () => {
  const [cName, setName] = useState('');
  const [cRoom, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const { name, room } = queryString.parse(location?.search);

  useEffect(() => {
    socket = io(ENDPOINT);
    console.log({name},{room});
    

    if(!name|| !room) return;

    setRoom(room);
    setName(name);

    
    socket.emit('join', { name, room }, (error) => {
      if(error) {
        console.log("yeh hus: ",error);
        alert(error);
      }
    });
  }, [name,room]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={cRoom} />
          <Messages messages={messages} name={cName} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;