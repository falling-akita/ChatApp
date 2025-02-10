export const mailValidate = (value: string) => {
  if (!/\S+@\S+\.\S+/.test(value)) {
    return "有効なメールアドレスを入力してください";
  } else {
    return "";
  }
};

export const userNameValidate = (value: string) => {
  if (value.length < 5) {
    return "5文字以上で入力してください";
  } else {
    return "";
  }
};
