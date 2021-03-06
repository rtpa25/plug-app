/** @format */

import { DataSnapshot, onValue, ref } from 'firebase/database';
import { FC, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { Login, CreateProfile, Profiles } from './pages/zExporter';
import { db } from './services/firebase';
import { setUserData } from './store/slices/userSlice';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkValidity = async () => {
      setIsLoading(true);
      try {
        const uuid = localStorage.getItem('uuid');
        if (!uuid) {
          setIsLoading(false);
          return;
        }
        const userRef = ref(db, 'users/' + uuid);
        onValue(userRef, (snapshot: DataSnapshot) => {
          const data = snapshot.val();
          dispatch(setUserData({ userData: data }));
        });
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    checkValidity();
  }, [dispatch]);

  const user = useAppSelector((state) => state.user.res);

  if (isLoading) {
    return <div>Loading</div>;
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path='/login'
            element={user.displayName !== '' ? <Profiles /> : <Login />}
          />
          <Route
            path='/create-profile'
            element={user.displayName !== '' ? <CreateProfile /> : <Login />}
          />
          <Route
            path='/'
            element={user.displayName !== '' ? <Profiles /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    );
  }
};

export default App;
