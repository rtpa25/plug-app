/** @format */

import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../services/firebase';
import { Button } from 'antd';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppDispatch } from '../hooks/index';
import { setUserData } from '../store/slices/userSlice';
import { ref, set } from 'firebase/database';

const Login: FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const manageUserData = async () => {
      if (user) {
        navigate('/create-profile');
      }
    };
    manageUserData();
  }, [navigate, user]);

  const signInHandler = async () => {
    //!TODO: need to improve type checking
    try {
      //reach out to google's server to authenticate with third party
      const user = await signInWithPopup(auth, provider);

      //set the fetched data to fireabse real time database--> this will update if the data is already set
      set(ref(db, 'users/' + user.user.uid), {
        displayName: user.user.displayName,
        email: user.user.email,
        photoUrl: user.user.photoURL,
        uuid: user.user.uid,
      }).catch((error) => {
        console.error(error);
      });

      //save the data to the redux slice
      dispatch(
        setUserData({
          userData: {
            displayName: user.user.displayName as string,
            email: user.user.email as string,
            photoUrl: user.user.photoURL as string,
            uuid: user.user.uid,
          },
        })
      );

      //navigate to the create profile page
      navigate('/create-profile');
    } catch (error) {
      alert('Please make sure you are connected to the internet');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Plug-App-Task</h2>
      <Button type='primary' onClick={signInHandler}>
        Sign-In With Google
      </Button>
    </div>
  );
};

export default Login;
