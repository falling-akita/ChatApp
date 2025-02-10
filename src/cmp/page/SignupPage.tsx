import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { auth, database } from "../Business/FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, setDoc, doc } from "firebase/firestore"; // 必要なFirestoreモジュールをインポート

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
}

export const SignAppPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [fetchError, setFetchError] = useState("");

  const navigate = useNavigate();

  // バリデーション処理
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    // メールアドレスの検証
    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    // パスワードの検証
    if (!formData.password) {
      newErrors.password = "パスワードを入力してください";
    } else if (formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上である必要があります";
    }

    // パスワード確認の検証
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // サインアップ処理
  const SignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // ユーザー作成後、ユーザー情報をFirestoreに保存
      await CreateUser(userCredential.user.uid);
      // サクセス処理後、ページ遷移
      navigate("/");
    } catch (err) {
      setFetchError((err as Error).message);
    }
  };

  // Firestoreにユーザー情報を保存
  const CreateUser = async (userId: string) => {
    try {
      const userRef = collection(database, "User");

      const userDocRef = doc(userRef, userId);

      await setDoc(userDocRef, {
        userId,
        name: formData.userName,
        email: formData.email,
        profileImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7YINgRwE4U6ng2QGtoSRMX3RvOhqgaozAg&s",
      });
    } catch (err) {
      console.log("ユーザー情報保存エラー:", err);
    }
  };

  // 入力変更時の処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 入力時にエラーをクリア
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      SignUp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            アカウント作成
          </h1>
          <p className="text-gray-600">メッセージアプリを始めましょう</p>
        </div>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-2">
            {fetchError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メールアドレス入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* ユーザーネーム */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ユーザーネーム
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.userName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="ユーザーネーム"
              />
            </div>
            {errors.userName && (
              <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
            )}
          </div>

          {/* パスワード入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="8文字以上"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* パスワード確認入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード（確認）
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="パスワードを再入力"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* サインアップボタン */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
          >
            <span>アカウントを作成</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* ログインリンク */}
          <p className="text-center text-sm text-gray-600">
            すでにアカウントをお持ちですか？{" "}
            <a
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => navigate("/")}
            >
              ログイン
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
