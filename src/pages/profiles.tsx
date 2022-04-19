/** @format */

import { Avatar, Button, List, Skeleton } from 'antd';
import { signOut } from 'firebase/auth';
import {
  ref,
  onValue,
  DataSnapshot,
  query,
  orderByChild,
  limitToLast,
  update,
  startAt,
  endAt,
  limitToFirst,
  startAfter,
} from 'firebase/database';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth, db } from '../services/firebase';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
} from '@ant-design/icons';

const Container = styled.div`
  margin: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Profiles: FC = () => {
  const navigate = useNavigate();
  const signoutHandler = async () => {
    await signOut(auth);
    localStorage.removeItem('uuid');
    navigate('/login');
  };

  const [sortedUserData, setSortedUserData] = useState<any[]>([]);
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
        let arr: any[] = [];
        snapshot.forEach((childSnap) => {
          arr.push(childSnap.val());
        });
        setSortedUserData(arr.sort((a, b) => b - a));
      });
      setisLoading(false);
    };
    fetchData();
  }, [lastVisible]);

  const voteHandler = async (
    uuidOfProfileToBeVoted: string,
    currentPoints: number,
    type: 'inc' | 'dec'
  ) => {
    const uuidOfCurrentUser = localStorage.getItem('uuid');
    let votes: any;
    let isVoted = false;
    onValue(
      ref(db, 'users/' + uuidOfProfileToBeVoted),
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        for (const key in data) {
          if (key === 'votes') {
            votes = data[key];
            if (
              votes[uuidOfCurrentUser as string] === (type === 'inc' ? 1 : -1)
            ) {
              isVoted = true;
              return;
            }
          }
        }
      }
    );
    if (!isVoted) {
      const updatedVotes = { ...votes };
      updatedVotes[uuidOfCurrentUser as string] = type === 'inc' ? 1 : -1;
      update(ref(db, 'users/' + uuidOfProfileToBeVoted), {
        votes: updatedVotes,
        points: type === 'inc' ? (currentPoints += 1) : (currentPoints -= 1),
      }).catch((error) => {
        console.error(error);
      });
    }
  };

  return (
    <Container>
      <List
        className='demo-loadmore-list'
        loading={isLoading}
        itemLayout='horizontal'
        dataSource={sortedUserData}
        renderItem={(item) => (
          <List.Item
            actions={
              item.uuid !== localStorage.getItem('uuid')
                ? [
                    <button
                      style={{ color: 'green', cursor: 'pointer' }}
                      onClick={() => {
                        voteHandler(item.uuid, item.points, 'inc');
                      }}>
                      <ArrowUpOutlined />
                    </button>,
                    <button
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => {
                        voteHandler(item.uuid, item.points, 'dec');
                      }}>
                      <ArrowDownOutlined />
                    </button>,
                  ]
                : [
                    <button
                      style={{ color: 'blue', cursor: 'pointer' }}
                      onClick={() => {
                        navigate('/create-profile');
                      }}>
                      <EditOutlined />
                    </button>,
                  ]
            }>
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.photoUrl} />}
                title={item.displayName}
                description={item.status}
              />
              <div>{item.points}</div>
            </Skeleton>
          </List.Item>
        )}
      />
      <ButtonContainer
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          style={{ textAlign: 'center' }}
          onClick={() => {
            setLastVisible((prevState) => {
              return (prevState += 6);
            });
          }}>
          Load More
        </Button>
        <Button onClick={signoutHandler}>Logout</Button>
      </ButtonContainer>
    </Container>
  );
};

export default Profiles;
