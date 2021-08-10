import React, { useEffect, useRef } from 'react';
import MessageStatusIcon from './MessageStatusIcon';

const Conversation = ({ user, chatDetails }) => {
  const dummyLastEleRef = useRef(null);
  const tmpChatList = [];
  for (let id in chatDetails) {
    if (chatDetails.hasOwnProperty(id)) tmpChatList.push(chatDetails[id]);
  }
  useEffect(() => {
    if (dummyLastEleRef.current)
      dummyLastEleRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatDetails]);
  return (
    <div className='conversation-wrapper'>
      {tmpChatList.map((chat) => (
        <div
          key={chat.timestamp}
          className={
            chat.sender === user.email
              ? 'conversation-token conversation-content-right'
              : 'conversation-token conversation-content-left'
          }
        >
          <div className='conversation-content'>
            <div>{chat.content}</div>
            <div className='dummy-bottom-content' ref={dummyLastEleRef}></div>
            <MessageStatusIcon status={chat.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Conversation;
