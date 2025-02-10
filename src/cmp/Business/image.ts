import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // モジュールから必要な関数をインポート
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; // Firestore 関数をインポート

// Firebase の初期化（Firestore のインスタンスを取得）
const firestore = getFirestore();

// Firebase Storage の初期化（getStorage を使う）
const storage = getStorage();

export const uploadImage = async (file: File): Promise<void> => {
  try {
    // ファイルタイプのチェック（画像形式のみ許可）
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, GIF, or WebP images are allowed.");
    }

    // ストレージの参照を作成
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`); // `images` フォルダに保存

    // 画像を Firebase Storage にアップロード
    const snapshot = await uploadBytes(storageRef, file);

    // アップロードした画像のダウンロード URL を取得
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Image uploaded successfully. Available at:", downloadURL);

    // Firestore に画像の URL を保存
    const imageRef = collection(firestore, "images"); // コレクションを取得
    await addDoc(imageRef, {
      url: downloadURL,
      name: file.name,
      createdAt: serverTimestamp(), // サーバータイムスタンプを使用
    });

    console.log("Image URL saved to Firestore");
  } catch (error) {
    console.error("Error uploading image:", (error as Error).message);
  }
};
