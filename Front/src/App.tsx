import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import Home from "./views/Home/Home";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
      <Routes>
        {/* page user */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}
