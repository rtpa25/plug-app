/** @format */

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../services/firebase';
import { Button, Image } from 'antd';
import { useAppDispatch } from '../hooks/index';
import { setUserData } from '../store/slices/userSlice';
import { DataSnapshot, onValue, ref, set } from 'firebase/database';
import axios from 'axios';
import { GoogleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  box-shadow: 13px 13px 31px 7px rgba(168, 167, 167, 0.62);
  margin: 0 10rem;
  border-radius: 10px;
  @media only screen and (max-width: 730px) {
    box-shadow: none;
  }
`;

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const googleSigninHandler = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      const userRef = ref(db, 'users/' + user.user.uid);
      onValue(userRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data === null) {
          set(ref(db, 'users/' + user.user.uid), {
            displayName: user.user.displayName,
            email: user.user.email,
            photoUrl: user.user.photoURL,
            uuid: user.user.uid,
            status: '',
            points: 0,
            votes: {
              asd: 1,
            },
            favourites: {
              asd: 1,
            },
          }).catch((error) => {
            console.error(error);
          });
        } else {
          dispatch(setUserData({ userData: data }));
        }
        localStorage.setItem('uuid', data.uuid);
        navigate('/create-profile');
      });
    } catch (error) {
      console.error(error);
    }
  };

  const anonymosSigninHandler = async () => {
    const res = await axios.get('https://randomuser.me/api/?results=1');
    const displayName =
      res.data.results[0].name.first + ' ' + res.data.results[0].name.last;
    const email = res.data.results[0].email;
    console.log(res.data.results[0].picture);
    const photoURL = res.data.results[0].picture.large;
    const uuid = res.data.results[0].login.uuid;

    set(ref(db, 'users/' + uuid), {
      displayName: displayName,
      email: email,
      photoUrl: photoURL,
      uuid: uuid,
      status: '',
      points: 0,
      votes: {
        asd: 1,
      },
      favourites: {
        asd: 1,
      },
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
          status: '',
          points: 0,
          votes: {},
          favourites: {},
        },
      })
    );

    localStorage.setItem('uuid', uuid);

    //navigate to the create profile page
    navigate('/create-profile');
  };

  return (
    <Container>
      <Image src='logo192.png' preview={false} />
      <Button
        onClick={googleSigninHandler}
        type='primary'
        shape='round'
        size='large'
        style={{ width: '20rem', margin: '1rem' }}
        icon={<GoogleOutlined />}>
        Sign-In With Google
      </Button>
      <Button
        type='ghost'
        shape='round'
        style={{ width: '20rem', margin: '1rem' }}
        onClick={anonymosSigninHandler}
        size='large'>
        Stay Anonymos
      </Button>
    </Container>
  );
};

export default Login;
