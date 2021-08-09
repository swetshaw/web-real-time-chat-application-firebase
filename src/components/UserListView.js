import React from 'react';
import firebase from 'firebase/app';

// we set activePeer when the user clicks on a peer to chat with
const UserListView = ({ user, userList, setActivePeer, activePeer }) => {
  // userList is an object, we convert it to an array tmpUserList
  const tmpUserList = [];

  for (let id in userList) {
    if (userList.hasOwnProperty(id)) tmpUserList.push(userList[id]);
  }

  // handlePeerClick called when the user clicks on a peer to chat with
  const handlePeerClick = (peerInfo) => {
    // we set active peer with the peer info of the currently opened conversation
    setActivePeer(peerInfo);
    const dbRef = firebase.database().ref();
    dbRef
      .child('Users')
      .child(user.uid)
      .get()
      .then((snapshot) => {
        dbRef
          .child('Users')
          .child(user.uid)
          .update({
            ...snapshot.val(),
            activePeer: peerInfo.uid, // we set activePeer for each user to update the seen status of the messages
          });
      });
  };
  // render
  return (
    <>
      {tmpUserList.map((peerInfo) =>
        peerInfo.uid !== user.uid ? (
          <div
            className={
              peerInfo.uid === activePeer.uid
                ? 'peer-selected peers-container'
                : 'peers-container'
            }
            key={peerInfo.email}
            onClick={() => {
              handlePeerClick(peerInfo);
            }}
          >
            <img
              src={peerInfo.profile_picture}
              className='peer-avatar'
              alt={peerInfo.displayName}
            />
            <div className='online-status'>
              {' '}
              {peerInfo.displayName}{' '}
              <span
                className={
                  peerInfo.isOnline ? 'online-marker' : 'offline-marker'
                }
              >
                &bull;
              </span>
            </div>
          </div>
        ) : (
          ''
        )
      )}
    </>
  );
};

export default UserListView;
