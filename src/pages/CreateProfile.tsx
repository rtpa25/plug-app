/** @format */

import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { FC } from 'react';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const CreateProfile: FC = () => {
  const navigate = useNavigate();
  const signoutHandler = async () => {
    await signOut(auth);
    navigate('/login');
  };
  return (
    <div>
      <Button type='primary' onClick={signoutHandler}>
        Logout
      </Button>
    </div>
  );
};

export default CreateProfile;
