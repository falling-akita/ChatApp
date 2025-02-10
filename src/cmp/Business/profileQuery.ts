import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Firestoreのインスタンスを取得
const db = getFirestore();

type USersProps = {
  id: string;
  email: string;
  name: string;
  profileImage: string;
  userId: string;
};

//ユーザーIDからプロフィールを取得する

export const getUsersByIds = async (ids: string[]) => {
  try {
    // userIdsからIDの配列だけを抽出

    const users: USersProps[] = []; // 最終的なユーザー情報を格納する配列

    // Firestoreでは "in" クエリが最大10件までなので、10件ずつ分けてクエリを実行
    const chunkSize = 10;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("id", "in", chunk));

      const querySnapshot = await getDocs(q);

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email as string,
          name: data.name as string,
          profileImage: data.profileImage as string,
          userId: data.userId as string,
        });
      });
    }

    console.log("取得したユーザー情報:", users);
    return users;
  } catch (error) {
    console.error("ユーザー情報の取得エラー:", error);
    return [];
  }
};
