/** @format */

import { Button, Input } from 'antd';
import { FC, useState } from 'react';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ref, update } from 'firebase/database';
import { setUserData } from '../store/slices/userSlice';
import styled from 'styled-components';

const { TextArea } = Input;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100vh;
  box-shadow: 13px 13px 31px 7px rgba(168, 167, 167, 0.62);
  margin: 0 10rem;
  border-radius: 10px;
  @media only screen and (max-width: 730px) {
    box-shadow: none;
    justify-content: center;
  }
`;

const Avatar = styled.img`
  border-radius: 50%;
  height: 100%;
  margin: 1rem;
  @media only screen and (max-width: 730px) {
    height: 50%;
    margin: 0;
  }
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 40vh;
`;

const UserName = styled.p`
  font-size: 2rem;
  font-weight: 400;
  color: #595959;
  margin: 1rem;
  @media only screen and (max-width: 730px) {
    margin: 0;
    font-size: 1rem;
  }
`;

const CreateProfile: FC = () => {
  const [status, setStatus] = useState('');
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.res);
  const submitStatusHandler = async () => {
    update(ref(db, 'users/' + userData.uuid), {
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
          points: 0,
          votes: {},
          favourites: {},
        },
      })
    );
    navigate('/');
  };
  const navigate = useNavigate();

  return (
    <Container>
      <UserContainer>
        <Avatar src={userData.photoUrl} alt='avataar' />
        <UserName>{userData.displayName}</UserName>
      </UserContainer>
      <TextArea
        showCount={true}
        rows={4}
        size='middle'
        style={{ width: '50vw', minWidth: '20rem', margin: '1rem' }}
        value={status}
        maxLength={200}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Button
        type='primary'
        shape='round'
        size='large'
        style={{ width: '20rem', margin: '1rem' }}
        onClick={submitStatusHandler}>
        Submit Status
      </Button>
    </Container>
  );
};

export default CreateProfile;
