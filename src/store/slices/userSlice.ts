/** @format */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IndividualUser, { user } from '../../types/user';

const initialState: IndividualUser = {
  res: {
    displayName: '',
    email: '',
    photoUrl: '',
    uuid: '',
    status: '',
    points: 0,
    votes: {},
    favourites: {},
  },
};

const UserSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ userData: user }>) => {
      state.res = action.payload.userData;
    },
  },
});

export const { setUserData } = UserSlice.actions;
export default UserSlice.reducer;
