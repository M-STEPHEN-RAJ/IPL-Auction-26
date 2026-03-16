import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  const playersRoute = isAdmin ? "/admin/players" : "/";
  const teamsRoute = isAdmin ? "/admin/teams" : "/teams";
  return (
    <>
      <div className="w-full flex justify-center py-5 bg-black">
        <div className="relative w-full flex justify-between items-center max-w-85 sm:max-w-150 md:max-w-180 lg:max-w-240 xl:max-w-300">
          <div className="flex items-center gap-2">
            <img className="w-8 h-8" src={logo} alt="" />
            <h2 className="text-lg lg:text-2xl font-semibold lg:font-bold text-[#E2D284] hidden md:block">
              IPL Auction'26
            </h2>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-8 sm:gap-12 text-white sm:text-lg font-medium">
            <button
              className="hover:text-[#7f7da5] cursor-pointer select-none"
              onClick={() => navigate(playersRoute)}
            >
              Players
            </button>

            <button
              className="hover:text-[#7f7da5] cursor-pointer select-none"
              onClick={() => navigate(teamsRoute)}
            >
              Teams
            </button>
          </div>
          <div onClick={() => navigate('/admin/login')} className="">
            <img
              className="w-8 h-8 rounded-full cursor-pointer"
              src="https://res.cloudinary.com/dt4ldt3x6/image/upload/v1758953629/PlanIt/iniudgs6d7aehxxit6qx.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
