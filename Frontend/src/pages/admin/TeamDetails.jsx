import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../../socket";
import back from "../../assets/back.png";
import rating from "../../assets/rating.png";
import sold from "../../assets/sold.png";
import unsold from "../../assets/unsold.png";
import available from "../../assets/available.png";
import more from "../../assets/more.png";
import BASE_URL from "../../utils/api";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/teams/${id}`);
      setTeam(res.data);
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const removePlayer = async (playerId) => {
    try {
      await axios.post(
        `${BASE_URL}/teams/remove-player`,
        { playerId },
        { withCredentials: true },
      );

      toast.success("Player removed from team");

      fetchTeam(); // refresh team data
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing player");
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    socket.on("playerSold", fetchTeam);
    socket.on("playerRemoved", fetchTeam);
    socket.on("auctionReset", fetchTeam);

    return () => {
      socket.off("playerSold");
      socket.off("playerRemoved");
      socket.off("auctionReset");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="p-10">Loading team...</div>;
  }

  const players = team.players || [];
  const remaining = team.totalPurse - team.spent;
  const foreignPlayers = players.filter((p) => p.isIndian === false).length;

  return (
    <>
      <div className="w-full h-screen flex justify-center py-10 bg-black">
        <div className="w-full max-w-85 sm:max-w-150 md:max-w-180 lg:max-w-240 xl:max-w-300 h-full space-y-8">
          <div className="flex items-center gap-8">
            <div
              onClick={() => navigate(-1)}
              className="w-fit flex items-center justify-center p-2 hover:bg-white/10 rounded-md cursor-pointer"
            >
              <img className="w-5 h-5" src={back} alt="" />
            </div>
            <h2 className="text-2xl font-bold text-white">{team.name}</h2>
          </div>

          <div className="grid grid-col-1 lg:grid-cols-3 gap-5">
            <div className="h-48.5 relative flex-1 border border-gray-800 px-6 py-4 rounded-md bg-[#38365B]">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              ></div>
              <h2 className="font-semibold text-xl text-white mb-3">
                Financial Summary
              </h2>

              <div className="space-y-2">
                <div className="flex">
                  <p className="flex-1 font-semibold text-xl text-white">
                    <span className="font-normal text-base">Total Purse</span>
                    <br /> ₹ {team.totalPurse / 100} Cr
                  </p>
                  <p className="flex-1 font-semibold text-xl text-white">
                    <span className="font-normal text-base">Spent</span>
                    <br /> ₹ {team.spent / 100} Cr
                  </p>
                </div>
                <p className="font-semibold text-xl text-white">
                  <span className="font-normal text-base">Remaining</span>
                  <br /> ₹ {remaining / 100} Cr
                </p>
              </div>
            </div>
            <div className="h-48.5 relative flex-1 border border-gray-800 px-6 py-4 rounded-md bg-[#38365B]">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              ></div>
              <h2 className="font-semibold text-xl text-white mb-3">
                Squad Status
              </h2>

              <div className="flex">
                <p className="flex-1 font-semibold text-xl text-white">
                  <span className="font-normal text-base">Total Players</span>
                  <br /> {players.length}/{team.maxPlayers}
                </p>
                <p className="flex-1 font-semibold text-xl text-white">
                  <span className="font-normal text-base">Foreign Players</span>
                  <br /> {foreignPlayers}/5
                </p>
              </div>
            </div>
            <div className="h-48.5 relative flex-1 border border-gray-800 px-6 py-4 rounded-md bg-[#38365B]">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              ></div>
              <h2 className="font-semibold text-xl text-white mb-3">
                Team Summary
              </h2>

              <div className="">
                <p className="text-white">highest player bid</p>
              </div>
            </div>
          </div>

          <div className="">
            <h2 className="font-medium text-lg text-white mb-5">
              Players <span className="text-sm">({players.length})</span>
            </h2>
            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player._id}
                  className="relative flex justify-between rounded-2xl pt-3 px-5 bg-[#38365B]"
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  ></div>
                  <div className="flex space-x-5">
                    <div className="relative">
                      <img
                        src={player.image}
                        alt=""
                        className="relative w-18 sm:w-24 h-18 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain z-10"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 sm:w-24 h-18 sm:h-24 md:w-26 md:h-26 lg:w-30 lg:h-30 bg-[#E2D284] rounded-full"></div>
                    </div>
                    <div className="flex flex-col justify-between pb-3">
                      <div className="">
                        <div className="flex items-center gap-2 sm:gap-5">
                          <h2 className="font-bold sm:text-xl text-[#E2D284]">
                            {player.name}
                          </h2>
                          <div className="flex items-center gap-1">
                            <img
                              src={rating}
                              alt=""
                              className="w-5 h-5 object-contain mb-1"
                            />
                            <p className="font-medium text-lg text-[#E2D284]">
                              {player.rating}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-sm sm:text-base text-white">
                          {player.country}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-white text-sm sm:text-base font-medium">
                          ₹ {player.soldPrice / 100} Cr
                        </p>
                        <h2 className="font-medium text-sm sm:text-base text-gray-300">
                          {player.role}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-8 lg:gap-12">
                    <img
                      src={
                        player.status === "sold"
                          ? sold
                          : player.status === "unsold"
                            ? unsold
                            : available
                      }
                      alt=""
                      className="w-12 sm:w-18 h-12 sm:h-18 lg:w-20 lg:h-20 object-contain bg-white rounded-full my-auto hidden sm:block"
                    />
                    <div className="relative">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(
                            openDropdown === player._id ? null : player._id,
                          );
                        }}
                        className="p-2 cursor-pointer"
                      >
                        <img
                          src={more}
                          className="w-4 sm:w-5 rotate-90"
                          alt=""
                        />
                      </div>

                      {openDropdown === player._id && (
                        <div className="absolute right-0 top-10 w-40 bg-white rounded-md shadow-md z-10">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlayer(player._id);
                              setOpenDropdown(null);
                            }}
                            className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-md cursor-pointer"
                          >
                            Remove Player
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDetails;
