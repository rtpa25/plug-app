/** @format */

import { DataSnapshot, onValue, ref } from 'firebase/database';
import { FC, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { Login, CreateProfile, Profiles } from './pages/zExporter';
import { db } from './services/firebase';
import { setUserData } from './store/slices/userSlice';

const App: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkValidity = async () => {
      const uuid = localStorage.getItem('uuid');
      console.log(uuid);
      if (!uuid) {
        return;
      }
      const userRef = ref(db, 'users/' + uuid);
      onValue(userRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        dispatch(setUserData({ userData: data }));
      });
    };
    checkValidity();
  }, [dispatch]);

  const user = useAppSelector((state) => state.user.res);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path='/create-profile'
          element={user ? <CreateProfile /> : <Login />}
        />
        <Route path='/profiles' element={user ? <Profiles /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
