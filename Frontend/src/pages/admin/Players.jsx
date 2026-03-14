import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddPlayerModal from "../../components/AddPlayerModal";
import search from "../../assets/search.png";
import dropdown from "../../assets/dropdown.png";
import rating from "../../assets/rating.png";
import sold from "../../assets/sold.png";
import unsold from "../../assets/unsold.png";
import available from "../../assets/available.png";
import more from "../../assets/more.png";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [nationality, setNationality] = useState("all");

  const [openDropdown, setOpenDropdown] = useState(null);
  const [openActionDropdown, setOpenActionDropdown] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  const statusRef = useRef();
  const roleRef = useRef();
  const nationalityRef = useRef();
  const teamRef = useRef();

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

  const refreshSelectedPlayer = async (playerId) => {
    try {
      const res = await axios.get(`http://localhost:5000/players/${playerId}`);
      setSelectedPlayer(res.data);
    } catch (err) {
      console.error("Error refreshing player:", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const assignPlayer = async () => {
    if (!selectedTeam) {
      toast.error("Select a team!");
      return;
    }

    if (!bidAmount) {
      toast.error("Enter bid amount!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/teams/buy-player",
        {
          playerId: selectedPlayer._id,
          teamId: selectedTeam._id,
          price: Number(bidAmount),
        },
        {
          withCredentials: true,
        },
      );

      setSelectedTeam(null);
      setBidAmount("");
      refreshSelectedPlayer(selectedPlayer._id);
      setOpenDropdown(null);

      fetchPlayers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const markUnsold = async () => {
    try {
      await axios.post(
        "http://localhost:5000/teams/unsold-player",
        { playerId: selectedPlayer._id },
        { withCredentials: true },
      );

      toast.success("Player marked as Unsold");

      refreshSelectedPlayer(selectedPlayer._id);

      fetchPlayers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error marking unsold");
    }
  };

  const deletePlayer = async (playerId) => {
    try {
      await axios.delete(`http://localhost:5000/players/${playerId}`, {
        withCredentials: true,
      });

      toast.success("Player deleted successfully");

      fetchPlayers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const removePlayer = async () => {
    try {
      await axios.post(
        "http://localhost:5000/teams/remove-player",
        { playerId: selectedPlayer._id },
        { withCredentials: true },
      );

      toast.success("Player removed from team");

      refreshSelectedPlayer(selectedPlayer._id);

      fetchPlayers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing player");
    }
  };

  const resetAuction = async () => {
  try {

    await axios.post(
      "http://localhost:5000/teams/reset-auction",
      {},
      { withCredentials: true }
    );

    toast.success("Auction reset successfully!");

    setSelectedPlayer(null);
    setSelectedTeam(null);
    setBidAmount("");

    fetchPlayers();
    fetchTeams();

  } catch (err) {
    toast.error(err.response?.data?.message || "Reset failed");
  }
};


  useEffect(() => {
    fetchTeams();
  }, []);

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
        !nationalityRef.current.contains(event.target) &&
        teamRef.current &&
        !teamRef.current.contains(event.target)
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
      <div className="w-full min-h-screen flex justify-center py-10 bg-black">
        <div className="w-full max-w-85 sm:max-w-150 md:max-w-180 lg:max-w-240 xl:max-w-300 h-full space-y-8">
          <div className="flex justify-end gap-5">
            <div
              onClick={() => setShowAddModal(true)}
              className="w-fit px-5 py-1.5 rounded-md cursor-pointer text-white bg-[#38365B]"
            >
              + Add Player
            </div>

            <div
              onClick={resetAuction}
              className="w-fit px-5 py-1.5 rounded-md cursor-pointer text-white bg-red-500"
            >
              Reset Auction
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 border border-gray-800 rounded-md p-3 space-y-3">
              <h2 className="font-bold text-xl text-white">Player Details</h2>

              {!selectedPlayer && (
                <div className="p-6 text-gray-500">
                  Select a player to see details
                </div>
              )}

              {selectedPlayer && (
                <div className="relative flex flex-col justify-between gap-5 rounded-md py-2 sm:py-3 md:py-2 lg:py-3 px-2 sm:px-5 md:px-2 lg:px-5 text-white bg-[#38365B]">
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  ></div>

                  <div className="flex">
                    <div className="w-fit relative">
                      <img
                        src={selectedPlayer.image}
                        alt=""
                        className="relative w-22 h-22 sm:w-28 sm:h-28 md:w-22 md:h-22 lg:w-28 lg:h-28 xl:w-34 xl:h-34 object-contain z-10"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-21 sm:w-27 h-21 sm:h-27 md:w-21 md:h-21 lg:w-27 lg:h-27 xl:w-33 xl:h-33 bg-[#E2D284] rounded-full"></div>
                    </div>

                    <div className="py-3 px-2 sm:px-5">
                      <h2 className="font-bold text-base sm:text-xl md:text-lg lg:text-xl xl:text-2xl text-[#E2D284]">
                        {selectedPlayer.name}
                      </h2>
                      <h2 className="font-medium text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-white">
                        {selectedPlayer.country}
                      </h2>
                      <div className="flex items-center gap-1 mt-2">
                        <img
                          src={rating}
                          alt=""
                          className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 object-contain mb-1"
                        />
                        <p className="font-semibold text-sm lg:text-base xl:text-lg text-[#E2D284]">
                          {selectedPlayer.rating}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 font-medium text-lg text-white px-3 py-1 rounded-md">
                      <span className="text-gray-300 text-base font-normal">
                        Role:
                      </span>{" "}
                      {selectedPlayer.role}
                    </div>
                    <div className="flex-1 font-medium text-lg text-white px-3 py-1 rounded-md">
                      <span className="text-gray-300 text-base font-normal">
                        Base Price:
                      </span>{" "}
                      ₹ {(selectedPlayer.basePrice / 100).toFixed(2)} Cr
                    </div>
                    <img
                      src={
                        selectedPlayer.status === "sold"
                          ? sold
                          : selectedPlayer.status === "unsold"
                            ? unsold
                            : available
                      }
                      alt=""
                      className="absolute top-5 right-5 w-12 h-12 sm:w-16 sm:h-16 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain bg-white rounded-full my-auto"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="h-70.5 flex-1 border border-gray-800 rounded-md p-3 space-y-3">
              <h2 className="font-bold text-xl text-white">Auction Actions</h2>

              {!selectedPlayer && (
                <div className="p-6 text-gray-500">
                  Select a player to perform auctions
                </div>
              )}

              {selectedPlayer && (
                <div className="space-y-5">
                  <div className="px-3">
                    <h2 className="text-white font-semibold text-xl">
                      {selectedPlayer?.name}
                    </h2>
                    <h2 className="text-gray-300 font-semibold text-lg">
                      ₹ {(selectedPlayer.basePrice / 100).toFixed(2)} Cr
                    </h2>
                  </div>

                  {selectedPlayer.status === "sold" ? (
                    <div className="space-y-4 px-3">
                      <div className="text-white text-lg">
                        <span className="text-gray-300">Sold to:</span>{" "}
                        {selectedPlayer.soldTo?.name}
                      </div>

                      <div className="text-white text-lg">
                        <span className="text-gray-300">Amount:</span> ₹{" "}
                        {(selectedPlayer.soldPrice / 100).toFixed(2)} Cr
                      </div>

                      <div
                        className="w-full text-center text-white px-3 py-2 rounded-md cursor-pointer bg-red-500"
                        onClick={() => removePlayer()}
                      >
                        Remove from {selectedPlayer.soldTo?.name}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-5 px-3">
                        <div
                          className="flex-1 space-y-2 relative"
                          ref={teamRef}
                        >
                          <h2 className="text-white">Select Team</h2>
                          <div
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === "team" ? null : "team",
                              )
                            }
                            className="w-full flex items-center justify-between px-4 py-1.5 bg-white border border-gray-300 rounded-md cursor-pointer"
                          >
                            {selectedTeam ? selectedTeam.name : "Select Team"}

                            <img
                              className={`w-4 h-4 transition-all ${
                                openDropdown === "team" ? "rotate-180" : ""
                              }`}
                              src={dropdown}
                              alt=""
                            />
                          </div>

                          {openDropdown === "team" && (
                            <div className="absolute w-40 border border-gray-300 bg-white rounded-xl shadow-md z-10">
                              {teams.map((team) => (
                                <div
                                  key={team._id}
                                  onClick={() => {
                                    setSelectedTeam(team);
                                    setOpenDropdown(null);
                                  }}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  {team.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h2 className="text-white">Bid Amount</h2>
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="Enter bid amount"
                            className="w-full px-3 py-1.5 rounded-md border border-gray-300 bg-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-5 px-3">
                        <div
                          onClick={assignPlayer}
                          className="flex-1 text-white text-center px-3 py-1.5 rounded-md cursor-pointer bg-[#38365B]"
                        >
                          Assign Player
                        </div>
                        <div
                          onClick={markUnsold}
                          className="flex-1 text-white text-center px-3 py-1.5 rounded-md cursor-pointer bg-red-500"
                        >
                          Mark Unsold
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 lg:gap-5">
            {/* Search */}
            <div className="w-full md:w-110 flex items-center gap-4 bg-white border border-gray-300 px-3 py-1.5 rounded-full">
              <img className="w-6" src={search} alt="" />
              <input
                className="w-full outline-none"
                placeholder="search for players"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Filters Container */}
            <div className="flex items-center gap-3 lg:gap-5">
              {/* Status Dropdown */}
              <div
                className="relative flex items-center gap-2 text-sm lg:text-base"
                ref={statusRef}
              >
                <p className="text-white">Status:</p>
                <div
                  onClick={() =>
                    setOpenDropdown(openDropdown === "status" ? null : "status")
                  }
                  className="flex items-center justify-between w-25 lg:w-30 xl:w-34 px-2 lg:px-4 py-1.5 bg-white border border-gray-300 rounded-md cursor-pointer capitalize"
                >
                  {status}
                  <img
                    className={`w-4 h-4 transition-all duration-200 ${openDropdown === "status" ? "rotate-180" : ""}`}
                    src={dropdown}
                    alt=""
                  />
                </div>

                {openDropdown === "status" && (
                  <div className="absolute top-12 left-0 w-25 lg:w-30 xl:w-40 border border-gray-300 bg-white rounded-xl shadow-md z-10">
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
              <div
                className="relative flex items-center gap-2 text-sm lg:text-base"
                ref={roleRef}
              >
                <p className="text-white">Role:</p>
                <div
                  onClick={() =>
                    setOpenDropdown(openDropdown === "role" ? null : "role")
                  }
                  className="flex items-center justify-between w-35 lg:w-45 xl:w-46 px-2 lg:px-4 py-1.5 bg-white border border-gray-300 rounded-md cursor-pointer capitalize truncate"
                >
                  {role}
                  <img
                    className={`w-4 h-4 transition-all duration-200 ${openDropdown === "role" ? "rotate-180" : ""}`}
                    src={dropdown}
                    alt=""
                  />
                </div>

                {openDropdown === "role" && (
                  <div className="absolute top-12 left-0 w-35 lg:w-45 xl:w-50 border border-gray-300 bg-white rounded-xl shadow-md z-10">
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
              <div
                className="relative flex items-center gap-2 text-sm lg:text-base"
                ref={nationalityRef}
              >
                <p className="text-white">Nationality:</p>
                <div
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === "nationality" ? null : "nationality",
                    )
                  }
                  className="flex items-center justify-between w-25 lg:w-30 xl:w-34 px-2 lg:px-4 py-1.5 bg-white border border-gray-300 rounded-md cursor-pointer capitalize"
                >
                  {nationality}
                  <img
                    className={`w-4 h-4 transition-all duration-200 ${openDropdown === "nationality" ? "rotate-180" : ""}`}
                    src={dropdown}
                    alt=""
                  />
                </div>

                {openDropdown === "nationality" && (
                  <div className="absolute top-12 left-0 w-25 lg:w-30 xl:w-40 border border-gray-300 bg-white rounded-xl shadow-md z-10">
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
          </div>

          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player._id}
                onClick={() => setSelectedPlayer(player)}
                className={`relative flex justify-between rounded-2xl px-5 bg-[#38365B] ${
                  openActionDropdown === player._id ? "z-50" : "z-0"
                }`}
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                ></div>
                <div className="flex space-x-5 pt-2">
                  <div className="relative">
                    <img
                      src={player.image}
                      alt=""
                      className="relative w-20 h-20 object-contain z-10"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-20 h-20 bg-[#E2D284] rounded-full"></div>
                  </div>
                  <div className="flex flex-col justify-between pb-3">
                    <div className="">
                      <div className="flex items-center gap-5">
                        <h2 className="font-bold text-xl text-[#E2D284]">
                          {player.name}
                        </h2>
                      </div>
                      <p className="font-medium text-white">{player.country}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <img
                    src={
                      player.status === "sold"
                        ? sold
                        : player.status === "unsold"
                          ? unsold
                          : available
                    }
                    alt=""
                    className="w-16 h-16 object-contain bg-white rounded-full my-auto"
                  />

                  <div className="relative">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionDropdown(
                          openActionDropdown === player._id ? null : player._id,
                        );
                      }}
                      className="rounded-full p-2 hover:bg-white/20 cursor-pointer"
                    >
                      <img className="w-4 rotate-90" src={more} alt="" />
                    </div>

                    {openActionDropdown === player._id && (
                      <div className="absolute right-0 top-10 w-28 border border-gray-300 bg-white rounded-xl shadow-md z-10">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            // edit logic later
                            toast("Edit feature coming soon");
                            setOpenActionDropdown(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Edit
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlayer(player._id);
                            setOpenActionDropdown(null);
                          }}
                          className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AddPlayerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          refreshPlayers={fetchPlayers}
        />
      </div>
    </>
  );
};

export default Players;
