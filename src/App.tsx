/** @format */

import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, CreateProfile, Profiles } from './pages/zExporter';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';

const App: FC = () => {
  const [user] = useAuthState(auth);
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
