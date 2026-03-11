import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/admin/Login";
import Players from "./pages/admin/Players";
import Teams from "./pages/admin/Teams";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/players" element={<Players />} />
        <Route path="/admin/teams" element={<Teams />} />
      </Routes>
    </>
  );
};

export default App;
