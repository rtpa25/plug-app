/** @format */

import { Button } from 'antd';
import { signOut } from 'firebase/auth';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../hooks';
import { auth } from '../services/firebase';

const Container = styled.div`
  background-color: #40a9ff;
  color: #ffffff;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Navbar: FC = () => {
  const navigate = useNavigate();
  const username = useAppSelector((state) => state.user.res.displayName);
  const signoutHandler = async () => {
    await signOut(auth);
    localStorage.removeItem('uuid');
    navigate('/login');
    window.location.reload();
  };
  return (
    <Container>
      <p style={{ margin: '.75rem' }}>{username}</p>
      <Button type='primary' onClick={signoutHandler}>
        Logout
      </Button>
    </Container>
  );
};

export default Navbar;
