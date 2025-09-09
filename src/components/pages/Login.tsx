import LoginModal from '@/components/core/modals/LoginModal';
import { useCoreStore } from '@/stores/core-store';
import { useState } from 'react';

export default function Login(props: LoginProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogin = (username: string, password: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    useCoreStore.setState({ error: undefined });
    props.onLogin();
    handleClose();
  };

  return (
    <div className="h-screen w-screen">
      <LoginModal isOpen={isOpen} onLogin={handleLogin} />
    </div>
  );
}

type LoginProps = {
  onLogin: () => void;
};
