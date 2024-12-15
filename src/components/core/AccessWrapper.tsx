import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ProfileModal from './modals/ProfileModal';

export default function AccessWrapper(props: AccessWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const allowAccess = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
      allowAccess();
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={allowAccess} />;
  }

  return (
    <div className="relative">
      <div className="absolute top-2.5 sm:top-3 right-4 sm:right-24 z-50">
        <Avatar onClick={openProfileModal}>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>Profile</AvatarFallback>
        </Avatar>
      </div>
      {props.children}
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} onLogout={logout} />
    </div>
  );
}

type AccessWrapperProps = {
  children: React.ReactNode;
};
