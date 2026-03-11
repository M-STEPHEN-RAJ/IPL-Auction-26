import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import search from "../../assets/search.png";
import dropdown from "../../assets/dropdown.png";
import rating from "../../assets/rating.png";
import sold from "../../assets/sold.png";
import unsold from "../../assets/unsold.png";
import available from "../../assets/available.png";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [nationality, setNationality] = useState("all");

  const [openDropdown, setOpenDropdown] = useState(null);

  const statusRef = useRef();
  const roleRef = useRef();
  const nationalityRef = useRef();

  const fetchPlayers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/players", {
        params: { name, status, role, nationality },
      });
      setPlayers(res.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, status, role, nationality]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target) &&
        roleRef.current &&
        !roleRef.current.contains(event.target) &&
        nationalityRef.current &&
        !nationalityRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statuses = ["all", "sold", "unsold", "available"];
  const roles = ["all", "Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"];
  const nationalities = ["all", "indian", "foreign"];

  if (loading) {
    return <div className="p-10">Loading players...</div>;
  }

  return (
    <>
      <div className="w-full h-screen flex justify-center py-10">
        <div className="w-full max-w-6xl h-full space-y-8">
          <div className="flex items-center gap-5">
            <div className="w-110 flex items-center gap-4 border border-gray-300 px-3 py-1.5 rounded-full">
              <img className="w-6" src={search} alt="" />
              <input
                className="w-full outline-none"
                placeholder="search for players"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {/* Status Dropdown */}
            <div className="relative flex items-center gap-2" ref={statusRef}>
              <p>Status:</p>
              <div
                onClick={() =>
                  setOpenDropdown(openDropdown === "status" ? null : "status")
                }
                className="flex items-center justify-between w-34 px-4 py-1.5 border border-gray-300 rounded-md cursor-pointer capitalize"
              >
                {status}
                <img className={`w-4 h-4 transition-all duration-200 ${openDropdown === "status" ? "rotate-180" : ""}`} src={dropdown} alt="" />
              </div>
              {openDropdown === "status" && (
                <div className="absolute top-12 left-15 w-40 border border-gray-300 bg-white rounded-xl shadow-md z-10">
                  {statuses.map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        setStatus(s);
                        setOpenDropdown(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role Dropdown */}
            <div className="relative flex items-center gap-2" ref={roleRef}>
              <p>Role:</p>
              <div
                onClick={() =>
                  setOpenDropdown(openDropdown === "role" ? null : "role")
                }
                className="flex items-center justify-between w-46 px-4 py-1.5 border border-gray-300 rounded-md cursor-pointer capitalize"
              >
                {role}
                <img className={`w-4 h-4 transition-all duration-200 ${openDropdown === "role" ? "rotate-180" : ""}`} src={dropdown} alt="" />
              </div>
              {openDropdown === "role" && (
                <div className="absolute top-12 left-11 w-50 border border-gray-300 bg-white rounded-xl shadow-md z-10">
                  {roles.map((r) => (
                    <div
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setOpenDropdown(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                    >
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nationality Dropdown */}
            <div className="relative flex items-center gap-2" ref={nationalityRef}>
              <p>Nationality:</p>
              <div
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "nationality" ? null : "nationality",
                  )
                }
                className="flex items-center justify-between w-34 px-4 py-1.5 border border-gray-300 rounded-md cursor-pointer capitalize"
              >
                {nationality}
                <img className={`w-4 h-4 transition-all duration-200 ${openDropdown === "nationality" ? "rotate-180" : ""}`} src={dropdown} alt="" />
              </div>
              {openDropdown === "nationality" && (
                <div className="absolute top-12 left-24 w-40 border border-gray-300 bg-white rounded-xl shadow-md z-10">
                  {nationalities.map((n) => (
                    <div
                      key={n}
                      onClick={() => {
                        setNationality(n);
                        setOpenDropdown(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="">
            {players.map((player) => (
              <div
                key={player._id}
                className="flex justify-between border border-gray-300 rounded-2xl pt-3 px-5"
              >
                <div className="flex space-x-5">
                  <img
                    src={player.image}
                    alt=""
                    className="w-34 h-34 object-contain"
                  />
                  <div className="flex flex-col justify-between pb-3">
                    <div className="">
                      <div className="flex items-center gap-5">
                        <h2 className="font-bold text-2xl">{player.name}</h2>
                        <div className="flex items-center gap-1">
                          <img
                            src={rating}
                            alt=""
                            className="w-6 h-6 object-contain mb-1"
                          />
                          <p className="font-semibold text-lg">
                            {player.rating}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-lg text-gray-500">
                        {player.country}
                      </p>
                    </div>
                      <h2 className="font-medium text-lg text-gray-700">
                        {player.role}
                      </h2>
                  </div>
                </div>
                <img
                  src={
                    player.status === "sold"
                      ? sold
                      : player.status === "unsold"
                        ? unsold
                        : available
                  }
                  alt=""
                  className="w-34 h-34 object-contain pb-3"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Players;
