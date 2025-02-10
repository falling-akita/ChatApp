import React, { useState, useEffect } from "react";
import { Search, Plus, Settings, MessageSquare } from "lucide-react";
import { AddRome } from "../Business/AddRome";
import { getUserRooms } from "../Business/GetUserRoom";
import { auth } from "../Business/FireBase";
import { Link, Navigate, useNavigate } from "react-router-dom";

// チャットルームの型定義
interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  participantsProfiles?: participantsProfilesPros[] | null;
}

type participantsProfilesPros = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  userId: string;
};

export const ChatRoomPage = () => {
  // チャットルーム情報
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  // ユーザープロフィール情報
  //   const [profile, setProfile] = useState<Profile[]>([]);
  const [AddUser, SetAddUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // ルーム情報を取得して、状態を更新する

    const UserID = auth.currentUser?.uid; // 現在ログインしているユーザーID
    if (!UserID) {
      console.log("User is not logged in.");

      navigate("/");
      return;
    }

    const unsubscribe = getUserRooms(UserID, (fetchedRooms) => {
      setRooms(fetchedRooms); // 取得したルーム情報を状態に保存
    });

    console.log("ルーム情報");

    // コンポーネントがアンマウントされたときに、リアルタイム監視を解除
    return () => unsubscribe();
  }, []);

  const UserID = auth.currentUser?.uid; // 現在ログインしているユーザーID
  if (!UserID) {
    console.error("User is not logged in.");
    const navigate = useNavigate();
    navigate("/");
    return;
  }

  // 検索バーの入力取得
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    SetAddUser(e.target.value); // 入力値を状態にセット
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          メッセージ
        </h1>
        <Link to={"/profileEdit"}>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </Link>
      </header>

      {/* 検索バーとアクションボタン */}
      <div className="p-4 bg-white border-b">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="チャットを検索"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={AddUser}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={() => AddRome({ AddUser: AddUser, UserID: UserID })}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* チャットルームリスト */}
      <div className="flex-1 overflow-y-auto ">
        {rooms.map((profile) => (
          <div
            key={profile.id}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
          >
            <Link
              to={`/messages`} // リンク先に遷移するURL
              state={profile.id || ""}
              onClick={() => console.log("遷移", profile.id)}
            >
              <div className="flex items-center space-x-3">
                {/* アバターとオンライン状態 */}
                <div className="relative">
                  <img
                    src={
                      profile.participantsProfiles?.[0]?.profileImage || "なし"
                    }
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                {/* メッセージ情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900 truncate">
                      {profile.participantsProfiles?.[0]?.name || "なし"}
                    </h2>
                    <span className="text-xs text-gray-500">{"なし"}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {"最後のメッセージ"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
