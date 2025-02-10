import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

//ユーザーIDからプロフィールを取得する

// Firestoreのインスタンスを取得
const db = getFirestore();

//処理被ってるから削除した方がいいかも

// ユーザーIDからプロフィールを取得する関数
export const getUserProfileById = async (userId: string) => {
  try {
    const usersRef = collection(db, "User");
    const userQuery = query(usersRef, where("userId", "==", userId));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0].data();
      return {
        id: userSnapshot.docs[0].id,
        name: user.name, // 必須プロパティを返す
        email: user.email,
        profileImage: user.profileImage,
        userId: user.userId,
      };
    } else {
      console.log(`ユーザーID ${userId} が見つかりません`);
      return null;
    }
  } catch (error) {
    console.error("ユーザー情報の取得エラー:", error);
    return null;
  }
};

type participantsProfilesPros = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  userId: string;
};

// ルームの型を定義
type Room = {
  id: string;
  name: string;
  participants: string[];
  participantsProfiles?: participantsProfilesPros[] | null;
};

// ユーザーが参加しているルームをリアルタイムで取得する関数
export const getUserRooms = (
  userId: string,
  callback: (rooms: Room[]) => void
) => {
  // ルームコレクションを取得
  const roomsRef = collection(db, "Room");

  // ユーザーが参加しているルームを取得するクエリ
  const q = query(roomsRef, where("participants", "array-contains", userId));

  // リアルタイムでルームデータを取得
  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    if (querySnapshot.empty) {
      console.log("ルームが見つかりません");
      return;
    }

    // ルームデータを配列に格納
    const rooms: Room[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      participants: doc.data().participants,
    }));

    console.log("ルームを表示", rooms);

    // ルーム内の自分以外の参加者を取得
    const roomsWithProfiles = await Promise.all(
      rooms.map(async (room) => {
        // 自分のIDを除外
        const otherParticipants = room.participants.filter(
          (participantId) => participantId !== userId
        );
        console.log("自分を除外", otherParticipants);

        // 他の参加者のプロフィールを取得
        const profiles = await Promise.all(
          otherParticipants.map(async (participantId) => {
            const profile = await getUserProfileById(participantId);
            if (profile) {
              console.log("取得", profile);
              return profile;
            } else {
              // プロフィールが見つからない場合、空のオブジェクトを返す
              return null;
            }
          })
        );

        // ルームに参加者のプロフィールを追加
        room.participantsProfiles = profiles.filter(
          (profile) => profile !== null
        ); // nullを除外
        console.log("最終", room);
        return room;
      })
    );

    // 取得したルーム情報をコールバック関数で返す
    callback(roomsWithProfiles);
  });

  // 監視を解除するための関数を返す
  return unsubscribe;
};
