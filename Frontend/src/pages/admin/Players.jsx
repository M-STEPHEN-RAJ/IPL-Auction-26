import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddPlayerModal from "../../components/AddPlayerModal";
import search from "../../assets/search.png";
import filter from "../../assets/filter.png";
import reset from "../../assets/reset.png";
import Delete from "../../assets/delete.png";
import edit from "../../assets/edit.png";
import dropdown from "../../assets/dropdown.png";
import rating from "../../assets/rating.png";
import sold from "../../assets/sold.png";
import unsold from "../../assets/unsold.png";
import available from "../../assets/available.png";
import more from "../../assets/more.png";
import BASE_URL from "../../utils/api";

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
  const [showFilters, setShowFilters] = useState(false);

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  const statusRef = useRef();
  const roleRef = useRef();
  const nationalityRef = useRef();
  const teamRef = useRef();

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/players`, {
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
      const res = await axios.get(`${BASE_URL}/players/${playerId}`);
      setSelectedPlayer(res.data);
    } catch (err) {
      console.error("Error refreshing player:", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/teams`);
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
        `${BASE_URL}/teams/buy-player`,
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
        `${BASE_URL}/teams/unsold-player`,
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
      await axios.delete(`${BASE_URL}/players/${playerId}`, {
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
        `${BASE_URL}/teams/remove-player`,
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
        `${BASE_URL}/teams/reset-auction`,
        {},
        { withCredentials: true },
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

  return (
    <>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center bg-black text-white">
          <div className="w-12 h-12 border-4 border-[#38365B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full min-h-screen flex justify-center pt-5 pb-20 bg-black">
          <div className="w-full max-w-85 sm:max-w-150 md:max-w-180 lg:max-w-240 xl:max-w-300 h-full space-y-8">
            <div className="flex justify-end gap-5">
              <div
                onClick={() => setShowAddModal(true)}
                className="w-fit px-3 sm:px-5 py-1 sm:py-1.5 text-sm sm:text-base rounded-md cursor-pointer text-white bg-[#38365B]"
              >
                + Add Player
              </div>

              <div
                onClick={resetAuction}
                className="flex items-center gap-2 w-fit px-3 sm:px-5 py-1 sm:py-1.5 text-sm sm:text-base rounded-md cursor-pointer text-white bg-red-500"
              >
                <img className="w-4 h-4" src={reset} alt="" />
                Reset Auction
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1 border border-gray-800 rounded-md p-3 space-y-3">
                <h2 className="font-semibold sm:font-bold text-base sm:text-xl text-white">
                  Player Details
                </h2>

                {!selectedPlayer && (
                  <div className="text-sm sm:text-base text-center p-6 text-gray-500">
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

                    <div className="flex gap-1.5 sm:gap-3">
                      <div className="flex-1 font-medium text-base sm:text-lg text-white px-3 py-1 rounded-md">
                        <span className="text-gray-300 text-sm sm:text-base font-normal">
                          Role
                        </span>
                        <br />
                        {selectedPlayer.role}
                      </div>
                      <div className="flex-1 font-medium text-base sm:text-lg text-white px-3 py-1 rounded-md">
                        <span className="text-gray-300 text-sm sm:text-base font-normal">
                          Base Price
                        </span>
                        <br />₹ {(selectedPlayer.basePrice / 100).toFixed(2)} Cr
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
              <div className="flex-1 border border-gray-800 rounded-md p-3 space-y-3">
                <h2 className="font-semibold sm:font-bold text-base sm:text-xl text-white">
                  Auction Actions
                </h2>

                {!selectedPlayer && (
                  <div className="text-sm sm:text-base text-center p-6 text-gray-500">
                    Select a player to perform auctions
                  </div>
                )}

                {selectedPlayer && (
                  <div className="flex flex-col justify-between space-y-5">
                    <div className="px-1.5 sm:px-3">
                      <h2 className="text-white font-semibold text-base sm:text-lg md:text-xl">
                        {selectedPlayer?.name}
                      </h2>
                      <h2 className="text-gray-300 font-medium text-lg">
                        ₹ {(selectedPlayer.basePrice / 100).toFixed(2)} Cr
                      </h2>
                    </div>

                    {selectedPlayer.status === "sold" ? (
                      <div className="space-y-4 px-1.5 sm:px-3">
                        <div className="text-white text-lg">
                          <span className="text-gray-300">Sold to: </span>
                          {selectedPlayer.soldTo?.name}
                        </div>

                        <div className="text-white text-lg">
                          <span className="text-gray-300">Amount:</span> ₹
                          {(selectedPlayer.soldPrice / 100).toFixed(2)} Cr
                        </div>

                        <div
                          className="w-full text-center text-white px-3 py-2 rounded-md select-none cursor-pointer bg-red-500"
                          onClick={() => removePlayer()}
                        >
                          Remove from {selectedPlayer.soldTo?.name}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-3 sm:gap-5 md:gap-3 lg:gap-5 px-1.5 sm:px-3 md:px-1.5 lg:px-3">
                          <div
                            className="flex-1 space-y-2 relative"
                            ref={teamRef}
                          >
                            <h2 className="text-sm sm:text-base text-white">
                              Select Team
                            </h2>
                            <div
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === "team" ? null : "team",
                                )
                              }
                              className="w-full flex items-center justify-between text-sm sm:text-base px-4 py-1.5 bg-white border border-gray-300 rounded-md cursor-pointer"
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
                              <div className="absolute w-40 border border-gray-300 text-sm sm:text-base bg-white rounded-xl shadow-md z-10">
                                {teams.map((team) => (
                                  <div
                                    key={team._id}
                                    onClick={() => {
                                      setSelectedTeam(team);
                                      setOpenDropdown(null);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-xl"
                                  >
                                    {team.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <h2 className="text-sm sm:text-base text-white">
                              Bid Amount
                            </h2>
                            <input
                              type="number"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder="Enter bid amount"
                              className="w-full text-sm sm:text-base px-3 py-1.5 rounded-md border border-gray-300 bg-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 sm:gap-5 md:gap-3 lg:gap-5 px-1.5 sm:px-3 md:px-1.5 lg:px-3">
                          <button
                            onClick={assignPlayer}
                            className="flex-1 text-white text-center px-3 py-1.5 rounded-md bg-[#38365B] text-sm sm:text-base select-none cursor-pointer"
                          >
                            Assign Player
                          </button>

                          <button
                            onClick={markUnsold}
                            className="flex-1 text-white text-center px-3 py-1.5 rounded-md bg-red-500 text-sm sm:text-base select-none cursor-pointer"
                          >
                            Mark Unsold
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="flex gap-3">
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

                <div
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 bg-white rounded-md cursor-pointer"
                >
                  <img className="w-5 h-5" src={filter} alt="" />
                </div>
              </div>

              {showFilters && (
                <div className="w-full bg-black text-white border border-gray-800 rounded-xl p-3 sm:p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-6 sm:gap-10">
                    <div>
                      <h3 className="font-semibold sm:text-lg mb-3">Status</h3>

                      {statuses.map((s) => (
                        <label
                          key={s}
                          className="flex items-center gap-2 mb-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="status"
                            value={s}
                            checked={status === s}
                            onChange={() => setStatus(s)}
                            className="accent-[#38365B]"
                          />
                          <span className="capitalize">{s}</span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold sm:text-lg mb-3">Role</h3>

                      {roles.map((r) => (
                        <label
                          key={r}
                          className="flex items-center gap-2 mb-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="role"
                            value={r}
                            checked={role === r}
                            onChange={() => setRole(r)}
                            className="accent-[#38365B]"
                          />
                          <span className="capitalize">{r}</span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-semibold sm:text-lg mb-3">
                        Nationality
                      </h3>

                      {nationalities.map((n) => (
                        <label
                          key={n}
                          className="flex items-center gap-2 mb-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="nationality"
                            value={n}
                            checked={nationality === n}
                            onChange={() => setNationality(n)}
                            className="accent-[#38365B]"
                          />
                          <span className="capitalize">{n}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setStatus("all");
                        setRole("all");
                        setNationality("all");
                      }}
                      className="text-sm sm:text-base bg-red-600 px-4 py-1 rounded-md hover:bg-red-700 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player._id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`relative flex justify-between rounded-2xl px-3 sm:px-5 bg-[#38365B] ${
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
                  <div className="flex space-x-3 sm:space-x-5 pt-2">
                    <div className="relative">
                      <img
                        src={player.image}
                        alt=""
                        className="relative w-16 sm:w-20 h-16 sm:h-20 object-contain z-10"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-16 sm:w-20 h-16 sm:h-20 bg-[#E2D284] rounded-full"></div>
                    </div>
                    <div className="flex flex-col justify-between pb-3">
                      <div className="">
                        <div className="flex items-center gap-5">
                          <h2 className="font-bold text-sm sm:text-xl text-[#E2D284]">
                            {player.name}
                          </h2>
                        </div>
                        <p className="text-xs sm:text-base font-medium text-white">
                          {player.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-8">
                    <img
                      src={
                        player.status === "sold"
                          ? sold
                          : player.status === "unsold"
                            ? unsold
                            : available
                      }
                      alt=""
                      className="w-11 h-11 sm:w-16 sm:h-16 object-contain bg-white rounded-full my-auto"
                    />

                    <div className="relative">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionDropdown(
                            openActionDropdown === player._id
                              ? null
                              : player._id,
                          );
                        }}
                        className="rounded-full p-2 hover:bg-white/20 cursor-pointer"
                      >
                        <img
                          className="w-3 sm:w-4 rotate-90"
                          src={more}
                          alt=""
                        />
                      </div>

                      {openActionDropdown === player._id && (
                        <div className="absolute right-0 top-10 w-28 border border-gray-300 bg-white rounded-xl shadow-md z-10">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toast("Edit feature coming soon");
                              setOpenActionDropdown(null);
                            }}
                            className="flex items-center gap-1.5  text-sm sm:text-base px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-xl"
                          >
                            <img className="w-5 h-5" src={edit} alt="" />
                            Edit
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlayer(player._id);
                              setOpenActionDropdown(null);
                            }}
                            className="flex items-center gap-1.5 text-sm sm:text-base px-4 py-1.5 sm:py-2 hover:bg-red-100 text-red-600 cursor-pointer rounded-xl"
                          >
                            <img className="w-5 h-5" src={Delete} alt="" />
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
      )}
    </>
  );
};

export default Players;
