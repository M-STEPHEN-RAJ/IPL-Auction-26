import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import rating from "../../assets/rating.png";
import players from "../../assets/players.png";
import foreign from "../../assets/foreign.png";

const Teams = () => {
  // const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/teams");
      setTeams(res.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center bg-black text-white">
          Loading teams...
        </div>
      ) : (
        <div className="w-full flex justify-center py-10 bg-black">
          <div className="w-full max-w-85 sm:max-w-150 md:max-w-180 lg:max-w-240 xl:max-w-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div
                key={team._id}
                // onClick={() => navigate(`/admin/team/${team._id}`)}
                className="relative bg-[#38365B] flex flex-col justify-between h-40 sm:h-48 px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 rounded-md"
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
    `,
                    backgroundSize: "30px 30px",
                  }}
                ></div>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-[#E2D284] text-2xl md:text-3xl">
                    {team.name}
                  </h2>
                  <div className="flex items-center gap-1 mt-2">
                    <img
                      src={rating}
                      alt=""
                      className="w-5 sm:w-6 md:w-7 h-5 sm-h-6 md:h-7 object-contain mb-1"
                    />
                    <p className="font-semibold text-base sm:text-lg md:text-2xl text-[#E2D284]">
                      {team.avgRating}
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-full flex">
                    <div className="flex-1 space-y-1">
                      <p className="text-white text-sm font-medium">
                        Remaining
                      </p>
                      <p className="text-white font-semibold text-xl md:text-2xl">
                        ₹ {team.remaining / 100} Cr
                      </p>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-white text-sm font-medium">Spent</p>
                      <p className="text-white font-semibold text-xl md:text-2xl">
                        ₹ {team.spent / 100} Cr
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex">
                    <div className="flex-1 flex items-center gap-2">
                      <img className="w-7" src={players} alt="" />
                      <p className="text-white font-semibold text-lg">
                        {team.totalPlayers} / 13
                      </p>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <img className="w-7" src={foreign} alt="" />
                      <p className="text-white font-semibold text-lg">
                        {team.foreignPlayers} / 5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Teams;
