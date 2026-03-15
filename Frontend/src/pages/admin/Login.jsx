import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import login_bg from "../../assets/login-bg.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/admin/login",
        { email, password },
        { withCredentials: true },
      );

      toast.success(res.data.message);
      navigate("/admin/players");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div className="flex w-screen h-screen overflow-hidden">
        {/* Left Theme */}
        <div className="relative hidden lg:block lg:w-1/2 h-full bg-[#38365B]">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="absolute top-0 right-0">
            <img src={login_bg} alt="" className="w-50 h-auto rotate-90" />
          </div>
          <div className="absolute bottom-0 left-0">
            <img src={login_bg} alt="" className="w-60 h-auto -rotate-90" />
          </div>
          <div className="flex items-center absolute top-5 left-5">
            <h2 className="text-[#E2D284] text-xl font-semibold">
              IPL Auction'26
            </h2>
          </div>

          <div className="relative w-full h-full z-10">
            <div className="w-full h-full flex flex-col justify-center items-center -mt-7">
              <img src={logo} alt="" className="w-80 h-auto" />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className=" bg-black w-1/2 h-full flex flex-col justify-center items-center mx-auto">
          <div className="space-y-10 min-w-80 sm:min-w-120 lg:min-w-100 xl:min-w-112.5">
            <img className="mx-auto w-35 sm:w-45 h-35 sm:h-45 lg:hidden" src={logo} alt="" />
            <div className="">
              <h2 className="text-2xl font-semibold text-white">Welcome Back!</h2>
            </div>

            <div className="space-y-5 -mt-3">
              <div className="flex flex-col gap-3">
                <label
                  className="text-sm font-medium text-white"
                  htmlFor="email"
                >
                  Your Email
                </label>
                <input
                  className="px-3 py-2 rounded-md outline-none bg-gray-800 text-white"
                  placeholder="example@gmail.com"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  className="text-sm font-medium text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="px-3 py-2 rounded-md outline-none bg-gray-800 text-white"
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleEnter}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#38365B] font-medium text-white py-2.5 rounded-md flex justify-center items-center disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
