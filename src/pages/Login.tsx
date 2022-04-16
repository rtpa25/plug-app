/** @format */

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../services/firebase';
import { Button } from 'antd';

const Login: FC = () => {
  const signInHandler = async () => {
    try {
      const userCredentials = await signInWithPopup(auth, provider);
      console.log(userCredentials);
    } catch (error) {
      alert('Please make sure you are connected to the internet');
      console.error(error);
    }
  };
  return (
    <div>
      <h2>Plug-App-Task</h2>
      <Link to={'/rooms'}>
        <Button type='primary' onClick={signInHandler}>
          Sign-In With Google
        </Button>
      </Link>
    </div>
  );
};

export default Login;
