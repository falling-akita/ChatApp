import { getReadStatus } from "./ReadChange";

export const fetchReadStatus = async (roomId: string) => {
  try {
    const ReadStatusGet = await getReadStatus(roomId);

    //未読かチェック
    if (ReadStatusGet?.read === "未読") {
      return "未読";
    } else {
      return "既読";
    }
  } catch (err) {
    console.error(err);
  }
};
