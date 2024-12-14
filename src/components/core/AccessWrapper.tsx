import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';

export default function AccessWrapper(props: AccessWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const allowAccess = () => {
    setIsAuthenticated(true);
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

  return props.children;
}

type AccessWrapperProps = {
  children: React.ReactNode;
};
