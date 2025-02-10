import { EditTextArea } from "../modules/ErditArea";
import { useState } from "react";
import { mailValidate } from "../Business/FormValidation";
import { userNameValidate } from "../Business/FormValidation";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type formDataType = {
  mail: string;
  userName: string;
  image: string;
};

type Errortype = {
  mail: string;
  username: string;
  image: string;
};

export const ProFileEditPage = () => {
  //フォームデータの管理
  const [formData, setFormData] = useState<formDataType>({
    mail: "",
    userName: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //エラーの管理
  const [error, setError] = useState<Errortype>({
    mail: "",
    username: "",
    image: "",
  });

  //バリデーション発動
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newErrors: Errortype = { mail: "", username: "", image: "" };

    newErrors.mail = mailValidate(formData.mail);
    newErrors.username = userNameValidate(formData.userName);

    setError(newErrors);
  };

  return (
    <div>
      <div className="relative w-full flex items-center mt-5">
        <p className="text-2xl font-bold mx-auto">Edit Profile</p>
        <Link to="/chatRoom" className="absolute left-10">
          <ArrowLeft />
        </Link>
      </div>

      <div className="flex justify-center items-center flex-col">
        <img
          src={
            "https://assets.st-note.com/production/uploads/images/134374862/rectangle_large_type_2_0422f9986b158259b154b86f688979bc.png?fit=bounds&quality=85&width=1280"
          }
          alt={"なし"}
          className="w-20 h-20 rounded-full object-cover mt-10"
        />

        <p className="mt-5 font-bold">イソ丸</p>

        <EditTextArea
          labelname="Email"
          placeforder="メールアドレス"
          value={formData.mail}
          name="mail"
          onchange={handleChange}
          errorMassage={error.mail}
        ></EditTextArea>
        <EditTextArea
          labelname="UserName"
          placeforder="ユーザーネーム"
          value={formData.userName}
          name="username"
          onchange={handleChange}
          errorMassage={error.username}
        ></EditTextArea>
        <EditTextArea
          labelname="Image"
          placeforder="トップ画像"
          value={formData.userName}
          name="username"
          onchange={handleChange}
          errorMassage={error.username}
        ></EditTextArea>

        <button
          onClick={handleSubmit}
          className="mt-3 bg-gray-300 w-24 h-12 rounded-full "
        >
          変更
        </button>
      </div>
    </div>
  );
};
