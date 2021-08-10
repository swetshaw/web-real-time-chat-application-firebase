import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import MessageInput from './MessageInput';
import ConversationView from './ConversationView';

const Channel = ({ user, activePeer }) => {
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState('');

  // we maintain conversation history to store the conversation ids that a the user has been a part of
  const UpdateConversationHistory = (convId) => {
    const dbRef = firebase.database().ref();
    dbRef
      .child('ConversationHistory/' + user.uid + '/' + convId)
      .update({ chat: true });
  };

  const updateStatus = (convId, user) => {
    const dbRef = firebase.database().ref();
    dbRef
      .child('Chats')
      .child(convId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const msgs = snapshot.val();
          const msgsKeys = Object.keys(msgs);
          for (let i = msgsKeys.length - 1; i >= 0; i--) {
            if (msgs[msgsKeys[i]].status === 'seen') break;
            if (user.email === msgs[msgsKeys[i]].receiver)
              dbRef
                .child('Chats')
                .child(convId)
                .child(msgsKeys[i])
                .update({ ...msgs[msgsKeys[i]], status: 'seen' });
          }
        }
      });
  };

  useEffect(() => {
    const dbRef = firebase.database().ref();
    dbRef
      .child('Chats')
      .child(user.uid + activePeer.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setConversationId(user.uid + activePeer.uid);
          UpdateConversationHistory(user.uid + activePeer.uid);
          updateStatus(user.uid + activePeer.uid, user);
        } else {
          setConversationId(activePeer.uid + user.uid);
          dbRef
            .child('Chats')
            .child(activePeer.uid + user.uid)
            .get()
            .then((snapshot) => {
              if (!snapshot.exists()) {
                const newMsgKey = dbRef
                  .child('Chats')
                  .child(activePeer.uid + user.uid)
                  .push().key;
                dbRef
                  .child('Chats/' + activePeer.uid + user.uid + '/' + newMsgKey)
                  .update({
                    sender: user.email,
                    receiver: activePeer.email,
                    content: '👋',
                    status: 'sent',
                    timestamp: new Date(),
                  });
              }
            });
          UpdateConversationHistory(activePeer.uid + user.uid);
          updateStatus(activePeer.uid + user.uid, user);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [activePeer]);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (conversationId) {
        const dbRef = firebase.database().ref();
        dbRef
          .child('Chats')
          .child(conversationId)
          .get()
          .then((snapshot) => {
            if (snapshot.exists()) {
              const msgs = snapshot.val();
              const msgsKeys = Object.keys(msgs);
              for (let i = msgsKeys.length - 1; i >= 0; i--) {
                if (msgs[msgsKeys[i]].status === 'seen') break;
                dbRef
                  .child('Chats')
                  .child(conversationId)
                  .child(msgsKeys[i])
                  .update({ ...msgs[msgsKeys[i]], status: 'seen' });
              }
            }
          });
      }
    });
  }, [conversationId]);
  const handleMessageInput = (event) => {
    // console.log(event.target.value, user.uid);
    setMessage(event.target.value);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    // console.log('Send Message clicked');
    const dbRef = firebase.database().ref();
    dbRef
      .child('Users')
      .child(activePeer.uid)
      .get()
      .then((snapshot) => {
        const peerVal = snapshot.val();
        let messageStatus = 'sent';
        if (peerVal.isOnline) {
          messageStatus = 'delivered';
        }
        const chatData = {
          sender: user.email,
          receiver: activePeer.email,
          content: message,
          status: messageStatus,
          timestamp: new Date(),
        };
        const newMsgKey = dbRef.child('Chats').child(conversationId).push().key;

        firebase
          .database()
          .ref('Chats/' + conversationId + '/' + newMsgKey)
          .update(chatData);
        setMessage('');
      });
  };

  return (
    <div className='conversation-container'>
      <div className='conversation-header'>
        Conversation with: {activePeer.displayName}
      </div>
      <ConversationView
        user={user}
        activePeer={activePeer}
        conversationId={conversationId}
      />

      <MessageInput
        sendMessage={sendMessage}
        handleMessageInput={handleMessageInput}
        message={message}
      />
    </div>
  );
};

export default Channel;
