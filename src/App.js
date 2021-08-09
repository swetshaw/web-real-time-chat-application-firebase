import React, { useEffect, useState } from 'react';
import './App.css';
import Channel from './components/Channel';
import EmptyChannelView from './components/EmptyChannelView';
import SideBar from './components/SideBar';
// Firebase deps
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { auth } from './services/firebase';


function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [userList, setUserList] = useState({});
  const [activePeer, setActivePeer] = useState('');

  // while the user details loads
  const [initializing, setInitializing] = useState(true); 
  
  // get all the users registered in the app
  useEffect(() =>{
    const dbRef = firebase.database().ref();
  dbRef.child("Users").get().then((snapshotUserList) => {
      if (snapshotUserList.exists()) {
        setUserList(snapshotUserList.val());
      } else {
    console.log("No data available");
  }}).catch((error) => {
    console.error(error);
  })
  }, []);

// function to update the status of sent messages to delivered when the user logs in into the app
const updateStatus = (convId) =>{
  const dbRef = firebase.database().ref()
  dbRef.child('Chats')
  .child(convId)
  .get()
  .then(snapshot => {
    if(snapshot.exists()){
      const msgs = snapshot.val();
      const msgsKeys = Object.keys(msgs);
      for (let i=msgsKeys.length - 1; i >=0; i--){
        if(msgs[msgsKeys[i]].status === 'delivered' || msgs[msgsKeys[i]].status === 'seen') break;
        if (msgs[msgsKeys[i]].status === 'sent')
          dbRef.child('Chats')
          .child(convId)
          .child(msgsKeys[i])
          .update({...msgs[msgsKeys[i]], status: 'delivered'})
      }
    }
  })
  
}
// gets the logged user from firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        firebase
          .database()
          .ref('Users/' + user.uid)
          .set({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            profile_picture: user.photoURL,
            isOnline:true
          });
          
        // when the user logs in , we get the list of all conversations the user is a part of and update the status of "sent" messages to "delivered"
        firebase.database().ref('ConversationHistory/'+user.uid).get().then((snapshot) => {
          if (snapshot.exists()){
            const conversationData = snapshot.val()
            for(let convId in conversationData){
              if(conversationData.hasOwnProperty(convId)){
                updateStatus(convId)
              }
            }
          }
        })
        
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, []);

  //used to sign in with Google
  const signInWithGoogle = async () => {
    // Retrieve Google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    // Set language to the default browser preference
    firebase.auth().useDeviceLanguage();
    // Start sign in process
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error.message);
    }
  };

  // function for signing out and set online status as offline
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      firebase
          .database()
          .ref('Users/' + user.uid)
          .set({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            profile_picture: user.photoURL,
            isOnline:false
          });
      setUserList({});
      setActivePeer('');
    } catch (error) {
      console.log(error.message);
    }
  }; 

  if (initializing) return 'Loading....';
 
  return (
    <div className='app-container'>
      {user ? (
        <>
          <div className="wave-chat-header">
            <h3>Wave-Chat</h3>
            <button className="auth-button btn-sign-out" onClick={signOut}>Sign Out</button>
          </div>
          <div className="chat-container">
            <div className="sidebar-container">
              <SideBar user={user} userList={userList} activePeer={activePeer} setActivePeer={setActivePeer} />
            </div>
            <div className="channel-container">
            {/* we will show the conversation channel when the user clicks on a peer */}
              { activePeer? <Channel user={user} activePeer={activePeer} /> : <EmptyChannelView /> }
            </div>
          </div>
        </>
      ) : (
        <button className="auth-button btn-sign-in" onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
}

export default App;
