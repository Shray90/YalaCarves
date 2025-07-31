import { useState } from 'react';
import { mockUsers, getCurrentUser, setCurrentUser } from '../data/mockData';

const UserSwitcher = () => {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());

  const handleUserChange = (user) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    // Refresh the page to update all components
    window.location.reload();
  };

  return (
    <div className="user-switcher">
      <div className="current-user">
        <span>Current User: <strong>{currentUser.name}</strong></span>
      </div>
      <div className="user-options">
        <label>Switch User: </label>
        <select 
          value={currentUser.id} 
          onChange={(e) => {
            const selectedUser = mockUsers.find(user => user.id === parseInt(e.target.value));
            if (selectedUser) {
              handleUserChange(selectedUser);
            }
          }}
        >
          {mockUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserSwitcher;