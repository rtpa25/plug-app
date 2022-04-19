/** @format */

import { Button  } from 'antd';
import {
  ref,
  onValue,
  DataSnapshot,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../services/firebase';
import Navbar from '../components/Navbar';
import { user } from '../types/user';
import ProfileShow from '../components/ProfileShow';


const Container = styled.div`
  margin: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Profiles: FC = () => {
  const [sortedUserData, setSortedUserData] = useState<user[]>([]);
  const [sortedFavouriteUserData, setSortedFavouriteUserData] = useState<
    user[]
  >([]);
  const [lastVisible, setLastVisible] = useState(6);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const fetchUserQuery = query(
        ref(db, 'users/'),
        orderByChild('points'),
        limitToLast(lastVisible)
      );
      onValue(fetchUserQuery, (snapshot: DataSnapshot) => {
        let arr: user[] = [];
        let favUserArr: user[] = [];
        const uuidOfSelf = localStorage.getItem('uuid');
        snapshot.forEach((childSnap) => {
          arr.push(childSnap.val());
        });
        arr.forEach((user) => {
          if (user.favourites[uuidOfSelf as string]) {
            favUserArr.push(user);
          }
        });
        setSortedFavouriteUserData(
          favUserArr.sort((a, b) => b.points - a.points)
        );
        setSortedUserData(arr.sort((a, b) => b.points - a.points));
      });

      setisLoading(false);
    };
    fetchData();
  }, [lastVisible]);

  return (
    <div>
      <Navbar />
      <Container>
        <ProfileShow
          isLoading={isLoading}
          sortedFavouriteUserData={sortedFavouriteUserData}
        />
        <ProfileShow
          isLoading={isLoading}
          sortedFavouriteUserData={sortedUserData}
        />
        <ButtonContainer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            onClick={() => {
              setLastVisible((prevState) => {
                return (prevState += 6);
              });
            }}>
            Load More
          </Button>
        </ButtonContainer>
      </Container>
    </div>
  );
};

export default Profiles;
