import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/admin/Login";
import Players from "./pages/admin/Players";
import Teams from "./pages/admin/Teams";
import TeamDetails from "./pages/admin/TeamDetails";
import Navbar from "./components/Navbar";

const App = () => {

  const location = useLocation();

  const hideNavbar = location.pathname === "/admin/login";

  return (
    <>
      <Toaster position="top-center" />

      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/players" element={<Players />} />
        <Route path="/admin/teams" element={<Teams />} />
        <Route path="/admin/team/:id" element={<TeamDetails />} />
      </Routes>
    </>
  );
};

export default App;
