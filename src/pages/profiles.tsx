/** @format */

import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const Profiles: FC = () => {
  const navigate = useNavigate();
  const signoutHandler = async () => {
    await signOut(auth);
    navigate('/login');
  };
  return (
    <div>
      <Button onClick={signoutHandler}>Logout</Button>
    </div>
  );
};

export default Profiles;
