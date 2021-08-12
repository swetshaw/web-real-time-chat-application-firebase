import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import Conversation from './Conversation';
import EmptyChannelView from './EmptyChannelView';

const ConversationView = ({ user, conversationId, activePeer }) => {
  const [chatDetails, setChatDetails] = useState({});
  useEffect(() => {
    try {
      if (conversationId) {
        const conversationRef = firebase
          .database()
          .ref('Chats/' + conversationId);

        conversationRef.on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // if (conversationId && ) {
            //   const dbRef = firebase.database().ref();
            //   dbRef
            //     .child('Chats')
            //     .child(conversationId)
            //     .get()
            //     .then((snapshot) => {
            //       if (snapshot.exists()) {
            //         const msgs = snapshot.val();
            //         const msgsKeys = Object.keys(msgs);
            //         for (let i = msgsKeys.length - 1; i >= 0; i--) {
            //           if (msgs[msgsKeys[i]].status === 'seen') break;
            //           dbRef
            //             .child('Chats')
            //             .child(conversationId)
            //             .child(msgsKeys[i])
            //             .update({ ...msgs[msgsKeys[i]], status: 'seen' });
            //         }
            //       }
            //     });
            // }
            setChatDetails({ [conversationId]: data });
          } else {
            setChatDetails({ [conversationId]: {} });
          }
        });
      } else {
        setChatDetails({});
      }
    } catch (e) {
      console.log(e);
    }
  }, [conversationId, activePeer]);

  return (
    <>
      {chatDetails[conversationId] ? (
        <Conversation user={user} chatDetails={chatDetails[conversationId]} />
      ) : (
        <EmptyChannelView></EmptyChannelView>
      )}
    </>
  );
};

export default ConversationView;
