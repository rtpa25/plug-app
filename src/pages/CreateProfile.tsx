/** @format */

import { Button, Input } from 'antd';
import { signOut } from 'firebase/auth';
import { FC, useState } from 'react';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { set, ref } from 'firebase/database';
import { setUserData } from '../store/slices/userSlice';

const { TextArea } = Input;

const CreateProfile: FC = () => {
  const [status, setStatus] = useState('');
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.res);
  const submitStatusHandler = async () => {
    set(ref(db, 'users/' + userData.uuid), {
      displayName: userData.displayName,
      email: userData.email,
      photoUrl: userData.photoUrl,
      uuid: userData.uuid,
      status: status,
    }).catch((error) => {
      console.error(error);
    });
    dispatch(
      setUserData({
        userData: {
          displayName: userData.displayName,
          email: userData.email,
          photoUrl: userData.photoUrl,
          uuid: userData.uuid,
          status: status,
        },
      })
    );
    navigate('/');
  };
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
      <TextArea
        rows={4}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Button type='primary' shape='round' onClick={submitStatusHandler}>
        Submit Status
      </Button>
    </div>
  );
};

export default CreateProfile;
