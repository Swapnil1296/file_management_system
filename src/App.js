import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import Home from "./pages/Home";
import AllFiles from "./pages/AllFiles";
import UploadFiles from "./pages/UploadFiles";
import RecordMedia from "./pages/RecordMedia";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/all-files" element={<AllFiles />} />
        <Route path="/record-media" element={<RecordMedia />} />
        <Route path="/upload-files" element={<UploadFiles />} />

        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
