import React from 'react';
import UserListView from './UserListView';

const SideBar = ({ user, userList, setActivePeer, activePeer }) => {
  return (
    <>
      {userList ? (
        <UserListView
          user={user}
          userList={userList}
          activePeer={activePeer}
          setActivePeer={setActivePeer}
        />
      ) : (
        'Fetching the active users'
      )}
    </>
  );
};

export default SideBar;
