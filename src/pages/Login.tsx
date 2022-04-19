/** @format */

import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../services/firebase';
import { Button, Image, Modal } from 'antd';
import { useAppDispatch } from '../hooks/index';
import { setUserData } from '../store/slices/userSlice';
import { DataSnapshot, onValue, ref, set } from 'firebase/database';
import axios from 'axios';
import { GoogleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import localforage from 'localforage';

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
  const [error, setError] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
    } catch (err) {
      console.error(err);
      setError(err);
      showModal();
    }
  };

  const anonymosSigninHandler = async () => {
    try {
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
      await localforage.setItem('anonym-uuid', uuid);

      //navigate to the create profile page
      navigate('/create-profile');
    } catch (err) {
      console.error(err);
      setError(err);
      showModal();
    }
  };

  const reloginWithAnonymousProfile = async () => {
    try {
      const uuid = await localforage.getItem('anonym-uuid');
      const userRef = ref(db, 'users/' + uuid);
      onValue(userRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data === null) {
          setError('Please provide a valid username or rejoin');
        } else {
          dispatch(setUserData({ userData: data }));
        }
        localStorage.setItem('uuid', data.uuid);
        navigate('/');
      });
      await localforage.setItem('anonym-uuid', uuid);
    } catch (err) {
      console.error(err);
      setError(err);
      showModal();
    }
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
      <Button
        type='primary'
        shape='round'
        style={{ width: '20rem', margin: '1rem' }}
        onClick={reloginWithAnonymousProfile}
        size='large'>
        ReLogin With Anonymous Username
      </Button>
      <Modal
        title={error}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default Login;
