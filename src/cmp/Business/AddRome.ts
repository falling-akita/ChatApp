import { collection, addDoc } from "firebase/firestore";
import { database } from "./FireBase";

type AddRomeProps = {
  UserID: string;
  AddUser: string;
};

//トークルームにユーザーを追加

export const AddRome = async (props: AddRomeProps) => {
  try {
    const userRef = collection(database, "Room");
    await addDoc(userRef, {
      name: `${props.AddUser}_${props.UserID}`,
      participants: [props.UserID, props.AddUser],
      //作成日時とかの追加した方がいいかも
    });
  } catch (err) {
    console.log("ルーム作成エラー", err);
  }
};
