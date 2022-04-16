/** @format */

import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login, CreateProfile, Profiles } from './pages/zExporter';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/create-profile' element={<CreateProfile />} />
        <Route path='/profiles' element={<Profiles />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
