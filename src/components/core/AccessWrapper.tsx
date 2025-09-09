import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ProfileModal from './modals/ProfileModal';
import { useCoreStore } from '@/stores/core-store';
import { ResponseError } from '@/constraints/enums/core-enums';

export default function AccessWrapper(props: AccessWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const error = useCoreStore((state) => state.error);
  const resetStore = useCoreStore((state) => state.resetStore);

  const allowAccess = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    closeProfileModal();
    resetStore();
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

  if (!isAuthenticated || error === ResponseError.InvalidCredentials) {
    return <Login onLogin={allowAccess} />;
  }

  return (
    <div className="relative">
      <div className="absolute top-2.5 sm:top-3.5 right-4 sm:right-24 z-50 cursor-pointer">
        <Avatar className="size-8" onClick={openProfileModal}>
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
