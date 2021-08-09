import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import Conversation from './Conversation';
import EmptyChannelView from './EmptyChannelView';

const ConversationView = ({ user, conversationId }) => {
  const [chatDetails, setChatDetails] = useState('');
  useEffect(() => {
    try {
      if (conversationId) {
        const conversationRef = firebase
          .database()
          .ref('Chats/' + conversationId);
        conversationRef.on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) setChatDetails(data);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [conversationId]);

  return (
    <>
      {chatDetails ? (
        <Conversation user={user} chatDetails={chatDetails} />
      ) : (
        <EmptyChannelView></EmptyChannelView>
      )}
    </>
  );
};

export default ConversationView;
