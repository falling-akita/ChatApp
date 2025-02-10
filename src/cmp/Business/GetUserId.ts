import { auth } from "./FireBase";

//ログインユーザーを取得

export const GetUserID = () => {
  const UserID = auth.currentUser?.uid;
  if (!UserID) {
    console.error("User is not logged in,SENDCMP");
    return;
  }

  return UserID;
};
