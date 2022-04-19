/** @format */

import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  HeartOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { List, Skeleton, Avatar } from 'antd';
import { FC } from 'react';
import { user } from '../types/user';
import { Typography } from 'antd';
import { onValue, ref, DataSnapshot, update } from 'firebase/database';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface ProfileShowProps {
  isLoading: boolean;
  sortedFavouriteUserData: user[];
}

const ProfileShow: FC<ProfileShowProps> = ({
  isLoading,
  sortedFavouriteUserData,
}) => {
  const navigate = useNavigate();
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

  const favouriteHandler = async (item: user) => {
    const uuidOfSelf = localStorage.getItem('uuid');
    if (item.uuid === uuidOfSelf) {
      return;
    }
    const keys = Object.keys(item.favourites);
    if (keys.includes(uuidOfSelf as string)) {
      const updatedFavourites = { ...item.favourites };
      delete updatedFavourites[uuidOfSelf as string];
      update(ref(db, 'users/' + item.uuid), {
        favourites: updatedFavourites,
      });
    } else {
      const updatedFavourites = { ...item.favourites };
      updatedFavourites[uuidOfSelf as string] = 1;
      update(ref(db, 'users/' + item.uuid), {
        favourites: updatedFavourites,
      });
    }
  };

  return (
    <div>
      <Title level={3} style={{ marginTop: '.75rem', marginBottom: '.75rem' }}>
        Your Favs
      </Title>
      <List
        className='demo-loadmore-list'
        loading={isLoading}
        itemLayout='horizontal'
        dataSource={sortedFavouriteUserData}
        renderItem={(item: user) => (
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
                    <button
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => {
                        favouriteHandler(item);
                      }}>
                      <HeartOutlined />
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
            <Skeleton avatar title={false} loading={isLoading} active>
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
    </div>
  );
};

export default ProfileShow;
