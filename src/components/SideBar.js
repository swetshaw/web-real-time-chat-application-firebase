import React from 'react';
import UserListView from './UserListView';

const SideBar = ({ user, userList, setActivePeer }) => {
  return (
    <>
      {userList ? (
        <UserListView
          user={user}
          userList={userList}
          setActivePeer={setActivePeer}
        />
      ) : (
        'Fetching the active users'
      )}
    </>
  );
};

export default SideBar;
