import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Business/FireBase";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 簡単なバリデーション
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    if (!email.includes("@")) {
      setError("有効なメールアドレスを入力してください。");
      return;
    }

    if (password.length < 3) {
      setError("パスワードは3文字以上で入力してください。");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password); // ログイン
    } catch (err) {
      console.log(err);

      setError((err as Error).message);
      return;
    }

    // バリデーション成功
    setError("");
    console.log("ログイン成功:", { email });

    // メッセージページへ遷移
    navigate("/chatRoom");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            メッセージアプリにログイン
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            アカウントにサインインして、メッセージのやり取りを始めましょう
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                ログイン状態を保持
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                パスワードをお忘れですか？
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogIn className="w-5 h-5 mr-2" />
            ログイン
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方は{" "}
              <a
                onClick={() => navigate("/signapp")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                新規登録
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
