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
import axios from 'axios';

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

  const googleSigninHandler = async () => {
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

      localStorage.setItem('uuid', user.user.uid);

      //navigate to the create profile page
      navigate('/create-profile');
    } catch (error) {
      alert('Please make sure you are connected to the internet');
      console.error(error);
    }
  };

  const anonymosSigninHandler = async () => {
    const res = await axios.get('https://randomuser.me/api/?results=1');
    const displayName =
      res.data.results[0].name.first + ' ' + res.data.results[0].name.last;
    const email = res.data.results[0].email;
    const photoURL = res.data.results[0].picture.thumbnail;
    const uuid = res.data.results[0].login.uuid;

    set(ref(db, 'users/' + uuid), {
      displayName: displayName,
      email: email,
      photoUrl: photoURL,
      uuid: uuid,
    }).catch((error) => {
      console.error(error);
    });

    //save the data to the redux slice
    dispatch(
      setUserData({
        userData: {
          displayName: displayName as string,
          email: email as string,
          photoUrl: photoURL as string,
          uuid: uuid,
        },
      })
    );

    localStorage.setItem('uuid', uuid);

    //navigate to the create profile page
    navigate('/create-profile');
  };

  return (
    <div>
      <h2>Plug-App-Task</h2>
      <Button type='primary' onClick={googleSigninHandler}>
        Sign-In With Google
      </Button>
      <Button type='primary' onClick={anonymosSigninHandler}>
        Stay Anonymos
      </Button>
    </div>
  );
};

export default Login;
