import React, { useEffect, useState } from "react";
import axios from "axios";
import players from "../../assets/players.png";
import foreign from "../../assets/foreign.png";
import dropdown from "../../assets/dropdown.png";

const Teams = () => {
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

  if (loading) {
    return <div className="p-10">Loading teams...</div>;
  }

  return (
    <>
      <div className="w-full min-h-screen flex justify-center py-10">
        <div className="w-full max-w-6xl h-full space-y-3">
          {teams.map((team) => (
            <div
              key={team._id}
              className="flex justify-between items-center h-20 px-8 py-5 border border-gray-300 rounded-md"
            >
              <h2 className="font-bold text-3xl">{team.name}</h2>
              <div className="flex items-center gap-8">
                <p>₹ {team.totalPurse / 100} Cr</p>
                <div className="flex items-center gap-2">
                  <img className="w-7" src={players} alt="" />
                  <p>
                    {team.players.length} / {team.maxPlayers}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img className="w-5" src={foreign} alt="" />
                  <p>
                    {team.players.filter((p) => p.isIndian === false).length} /
                    5
                  </p>
                </div>

                <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                    <img className="w-4 h-4" src={dropdown} alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Teams;
