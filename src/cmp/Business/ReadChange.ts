import { collection, getDoc, setDoc, doc } from "firebase/firestore"; // 必要なFirestoreモジュールをインポート
import { database } from "./FireBase";
import { GetUserID } from "./GetUserId";

type ReadInfo = {
  SenduserID: string; // 送信者ID
  read: string; // 既読状態
};

//メッセージ送信時に未読を設定する
export const readChange = async (RoomID: string) => {
  const GetReadInfo = await getReadStatus(RoomID);
  console.log("既読状態", GetReadInfo);
  const UserId = GetUserID();

  //送信者とIDが同じ場合、処理を抜ける
  if (GetReadInfo?.SenduserID === UserId) {
    console.log("同一ユーザー");
    return;
  }

  const messageId = "OnliDoc";

  try {
    const readRef = doc(
      collection(database, "Room", RoomID, "Read"), // Room/ルームID/Read（サブコレクション）
      messageId // サブコレクション内のドキュメントID（messageId）
    );

    // サブコレクションにデータをセット
    await setDoc(readRef, {
      SenduserID: GetUserID(), // 送信者ID
      read: "既読", // 既読状態
    });
  } catch (err) {
    console.error(err);
  }
};

// 既読状態のドキュメントをルームIDから取得する
export const getReadStatus = async (roomId: string) => {
  const docRef = doc(database, "Room", roomId, "Read", "OnliDoc");

  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();

      const ReadInfo: ReadInfo = {
        SenduserID: data.SenduserID,
        read: data.read,
      };

      return ReadInfo;
    } else {
      console.log("ドキュメントが見つかりませんでした");
    }
  } catch (error) {
    console.error("データ取得エラー:", error);
  }
};
