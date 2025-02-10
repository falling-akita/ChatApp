import { doc, getDoc } from "firebase/firestore"; // 必要なFirestoreモジュールをインポート
import { database } from "./FireBase";
import { GetUserID } from "./GetUserId";

//ルームIDから相手のプロフィールを取得する
//メッセージ画面で使用

export const fetchRecipientData = async (RoomID: string) => {
  interface RoomInfoType {
    name: string; // 部屋の名前
    participants: string[]; // ユーザーIDの配列
  }

  try {
    if (!RoomID) {
      throw new Error("ルームIDの取得ができていません");
    }

    const MessageRecipientRef = doc(database, "Room", RoomID);
    const roomSnapshot = await getDoc(MessageRecipientRef);
    const RoomInfo = roomSnapshot.data() as RoomInfoType;
    console.log(RoomInfo);

    const LoginedUserID = GetUserID();
    if (LoginedUserID === undefined) {
      return;
    }

    if (RoomInfo) {
      console.log("ユーザー情報", RoomInfo.participants);
      const otherParticipants = RoomInfo.participants.filter(
        (participant) => participant !== LoginedUserID
      );
      console.log("相手のID取得", otherParticipants);

      const Profile = await IDtoProfile(otherParticipants[0]);

      console.log("相手のプロフィール", Profile);

      return Profile;
    } else {
      console.log("ルームの取得ができていません");
      return null;
    }
  } catch (error) {
    console.error("Error fetching recipient data: ", error);
  }
};

const IDtoProfile = async (id: string) => {
  type ProfileType = {
    email: string;
    name: string;
    profileImage: string;
    userId: string;
  };

  try {
    const ProfileQueryRef = doc(database, "User", id);
    const ProfileSnapShot = await getDoc(ProfileQueryRef);
    const ProfileInfo = ProfileSnapShot.data() as ProfileType;
    return ProfileInfo;
  } catch (err) {
    console.error(err);
  }
};
