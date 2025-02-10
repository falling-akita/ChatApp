import { Send, MoreVertical, Phone, Video } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { auth, database } from "../Business/FireBase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore"; // 必要なFirestoreモジュールをインポート
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRecipientData } from "../Business/RoomIDtoUserProfile";
import { readChange } from "../Business/ReadChange";
import { fetchReadStatus } from "../Business/ReadTextChange";

//メッセージのデータ型
type Message = {
  senderId: string; // ユーザーID
  message: string;
  timestamp: timeStamp;
};

type timeStamp = {
  nanoseconds: number;
  seconds: number;
  value?: string;
};

//プロフィールのデータ型
type ProfileType = {
  email: string;
  name: string;
  profileImage: string;
  userId: string;
};

export const MassagePage = () => {
  //メッセージの状態管理
  const [messages, setMessages] = useState<Message[]>([]);

  //相手の情報を管理
  const [MessageRecipient, setMessageRecipient] = useState<
    ProfileType | null | undefined
  >();

  //ファイルの状態管理
  const [file, setFile] = useState<File | null>(null);

  //チャットルームのIDを受ける
  //取得できてない時のエラーハンドリング
  const location = useLocation();
  const RoomID = location.state;

  // 入力テキストの状態管理
  const [inputText, setInputText] = useState("");

  //既読状態を管理
  const [readStatus, setReadStatus] = useState<string | undefined>("");

  // メッセージエリアへの参照
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール機能
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // メッセージが更新されたら自動スクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // メッセージのリアルタイムリスナー
    //メッセージの取得

    if (!RoomID) {
      throw new Error("ルームIDの取得ができていません");
    }

    const getRead = async () => {
      const getReadStatus = await fetchReadStatus(RoomID);
      console.log("ステータス表示", getReadStatus);
      setReadStatus(getReadStatus);
    };

    //既読状態のチェック
    const readDocRef = doc(database, "Room", RoomID, "Read", "OnliDoc");
    console.log("既読チェック");
    const ReadUnsubscribe = onSnapshot(readDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        console.log("ドキュメントが更新されました:", docData);
        //既読状態の表示関数
        getRead();
      } else {
        console.log("ドキュメントが見つかりませんでした");
      }
    });

    //メッセージの確認
    const messagesRef = collection(database, "Room", RoomID, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Message;

        // タイムスタンプの変換処理
        if (data.timestamp && data.timestamp.seconds) {
          const date = new Date(data.timestamp.seconds * 1000); // 秒をミリ秒に変換
          // 時間 (HH:MM:SS) の形式にフォーマット
          const formattedTime = `${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          // Message 型に合わせて変換した時間を格納
          data.timestamp.value = formattedTime;
        }

        return data;
      });

      setMessages(messagesData);

      console.log(messages);
    });

    // コンポーネントのアンマウント時にリスナーを解除
    return () => {
      unsubscribe();
      ReadUnsubscribe();
    };
  }, [RoomID]);

  //初期表示時に相手の情報を取得
  useEffect(() => {
    console.log("情報取得", fetchRecipientData(RoomID));

    readChange(RoomID);

    const navigate = useNavigate();

    navigate("/");

    const loadRecipientData = async () => {
      try {
        const MessageRecipientProfile = await fetchRecipientData(RoomID);

        setMessageRecipient(MessageRecipientProfile);
      } catch (err) {
        console.error(err);
      }
    };

    loadRecipientData();
  }, []);

  //ユーザーID取得
  const UserID = auth.currentUser?.uid; // 現在ログインしているユーザーID
  if (!UserID) {
    console.error("User is not logged in,SENDCMP");
    return;
  }

  //既読フラッグを作成、更新
  const readStateChange = async () => {
    const messageId = "OnliDoc";

    try {
      const readRef = doc(
        collection(database, "Room", RoomID, "Read"), // Room/ルームID/Read（サブコレクション）
        messageId // サブコレクション内のドキュメントID（messageId）
      );

      // サブコレクションにデータをセット
      await setDoc(readRef, {
        SenduserID: UserID, // 送信者ID
        read: "未読", // 既読状態
      });
    } catch (err) {
      console.error(err);
    }
  };

  //メッセージ送信
  const handleSendMessage = async () => {
    console.log(RoomID);

    if (inputText.trim()) {
      // メッセージを送信
      const messagesRef = collection(database, "Room", RoomID, "messages");
      await addDoc(messagesRef, {
        senderId: UserID, // ユーザーID
        message: inputText,
        timestamp: serverTimestamp(), // サーバー時間
      });

      readStateChange();

      // メッセージ送信後、入力フィールドをクリア
      setInputText("");
    }
  };

  //画像選択処理
  const ImageHandle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Enterキーでメッセージを送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      //メッセージを送信
      handleSendMessage();
      //既読状態を更新
      readStateChange();
    }
  };

  if (!messages) {
    return <div>roading ....</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={MessageRecipient?.profileImage}
            alt="プロフィール画像"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="font-semibold"></h1>
            <p className="text-xs text-gray-500">{MessageRecipient?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            //キーを一旦タイムスタンプにする
            // key={message.timestamp.value}
            className={`flex ${
              message.senderId === UserID ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`flex`}>
              {index === messages.length - 1 && (
                <div
                  className={`${
                    message.senderId === UserID ? "text-xs mt-9 mr-1" : "hidden"
                  }`}
                >
                  <p>{readStatus}</p>
                </div>
              )}

              <div
                className={`max-w-[100%] rounded-2xl px-4 py-2 ${
                  message.senderId === UserID
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p>{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === UserID
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp
                    ? message.timestamp.value
                    : "タイムスタンプがありません"}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* メッセージ入力エリア */}
      <div className="bg-white p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <input type="file" onChange={ImageHandle} />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
