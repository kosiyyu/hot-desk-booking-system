import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  isAuthenticated,
  getUserId,
  getUserEmail,
  getUsername,
  isAdmin,
} from '../utils/auth';

const User: React.FC = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userId = getUserId();
  const userEmail = getUserEmail();
  const username = getUsername();

  return (
    <div className="container mx-auto mt-10">
      <div className="text-2xl font-bold mb-4">Hi, {username}</div>
      <div className="font-bold">Profile</div>
      <div className="bg-white px-2 pt-2 pb-2 mb-2 rounded-lg border">
        <div>
          <strong>User ID:</strong> {userId}
        </div>
        <div>
          <strong>Email:</strong> {userEmail}
        </div>
        <div>
          <strong>Role:</strong> {isAdmin() ? 'User' : 'Guest'}
        </div>
        <div>
          <strong>Username:</strong> {username}
        </div>
      </div>
    </div>
  );
};

export default User;
