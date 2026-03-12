import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import back from "../../assets/back.png";
import rating from "../../assets/rating.png";
import sold from "../../assets/sold.png";
import unsold from "../../assets/unsold.png";
import available from "../../assets/available.png";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/teams/${id}`);
      setTeam(res.data);
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
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
        <div className="w-full max-w-6xl h-full space-y-8">
          <div className="flex items-center gap-8">
            <div
              onClick={() => navigate(-1)}
              className="w-fit flex items-center justify-center p-3 bg-white hover:bg-gray-300 rounded-full cursor-pointer"
            >
              <img className="w-5 h-5" src={back} alt="" />
            </div>
            <h2 className="text-3xl font-bold text-white">{team.name}</h2>
          </div>

          <div className="flex gap-5">
            <div className="flex-1 border border-gray-300 px-5 py-2.5 rounded-md">
              <h2 className="font-semibold text-2xl text-white">Financial Summary</h2>

              <div className="">
                <p className="text-white">Total Purse ₹{team.totalPurse / 100} Cr</p>
                <p className="text-white">Spent ₹{team.spent / 100} Cr</p>
                <p className="text-white">Remaining ₹{remaining / 100} Cr</p>
              </div>
            </div>
            <div className="flex-1 border border-gray-300 px-5 py-2.5 rounded-md">
              <h2 className="font-semibold text-2xl text-white">Squad Status</h2>

              <div className="">
                <p className="text-white">
                  Total Players {players.length}/{team.maxPlayers}
                </p>
                <p className="text-white">Foreign Players {foreignPlayers}/5</p>
              </div>
            </div>
            <div className="flex-1 border border-gray-300 px-5 py-2.5 rounded-md">
              <h2 className="font-semibold text-2xl text-white">Team Summary</h2>

              <div className="">
                <p className="text-white">highest player bid</p>
              </div>
            </div>
          </div>

          <div className="">
            <h2>Players ({players.length})</h2>
            <div className="">
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
                        className="relative w-34 h-34 object-contain z-10"
                      />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-33 h-33 bg-[#E2D284] rounded-full"></div>
                    </div>
                    <div className="flex flex-col justify-between pb-3">
                      <div className="">
                        <div className="flex items-center gap-5">
                          <h2 className="font-bold text-2xl text-[#E2D284]">
                            {player.name}
                          </h2>
                          <div className="flex items-center gap-1">
                            <img
                              src={rating}
                              alt=""
                              className="w-6 h-6 object-contain mb-1"
                            />
                            <p className="font-semibold text-lg text-[#E2D284]">
                              {player.rating}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-lg text-white">
                          {player.country}
                        </p>
                      </div>
                      <h2 className="font-medium text-lg text-gray-300">
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
                    className="w-25 h-25 object-contain bg-white rounded-full my-auto"
                  />
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
