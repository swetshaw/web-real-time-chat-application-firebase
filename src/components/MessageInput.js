import React from 'react';

const MessageInput = ({ sendMessage, handleMessageInput, message }) => {
  return (
    <form onSubmit={sendMessage} className='send-message-container'>
      <div className='send-message-wrapper'>
        <input
          type='text'
          onChange={handleMessageInput}
          value={message}
          placeholder='Enter your message'
        />
      </div>
      <div className='send-button-wrapper'>
        <button type='submit' onClick={sendMessage}>
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
