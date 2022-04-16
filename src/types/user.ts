/** @format */

export default interface IndividualUser {
  res: user;
}

export interface user {
  displayName: string;
  photoUrl: string;
  uuid: string;
  email: string;
  status: string;
}
