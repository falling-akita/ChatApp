import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatRoomPage } from "./cmp/page/ChatRoomPage";
import { ProFileEditPage } from "./cmp/page/ProFileEditPage";
import { LoginPage } from "./cmp/page/LoginPage";
import { SignAppPage } from "./cmp/page/SignupPage";
import { MassagePage } from "./cmp/page/MassagePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/messages" element={<MassagePage />} />
      <Route path="/chatRoom" element={<ChatRoomPage />} />
      <Route path="/signapp" element={<SignAppPage />} />
      <Route path="/profileEdit" element={<ProFileEditPage />} />
    </Routes>
  );
}

export default App;
