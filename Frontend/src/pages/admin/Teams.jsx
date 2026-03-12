import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import players from "../../assets/players.png";
import foreign from "../../assets/foreign.png";

const Teams = () => {

  const navigate = useNavigate();

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

  const teamColors = {
    "Team 1": { primary: "#F9CD05", secondary: "#ffffff" },
    "Team 2": { primary: "#004BA0", secondary: "#ffffff" },
    "Team 3": { primary: "#DA1818", secondary: "#ffffff" },
    "Team 4": { primary: "#3A225D", secondary: "#ffffff" },
    "Team 5": { primary: "#EA1A85", secondary: "#ffffff" },
    "Team 6": { primary: "#EE7429", secondary: "#ffffff" },
    "Team 7": { primary: "#17449B", secondary: "#ffffff" },
    "Team 8": { primary: "#D71920", secondary: "#ffffff" },
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center py-10 bg-black">
        <div className="w-full max-w-6xl h-full space-y-3">
          {teams.map((team) => (
            <div
              key={team._id}
              onClick={() => navigate(`/admin/team/${team._id}`)}
              style={{
  background: `linear-gradient(
    to top left,
    #ffffff -200%,
    ${teamColors[team.name]?.primary} 40%,
    #ffffff 200%
  )`
}}
              className="relative flex justify-between items-center h-20 px-8 py-5 rounded-md"
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `
      linear-gradient(${teamColors[team.name]?.secondary}33 1px, transparent 1px),
      linear-gradient(90deg, ${teamColors[team.name]?.secondary}33 1px, transparent 1px)
    `,
                  backgroundSize: "30px 30px",
                }}
              ></div>
              <h2
                className="font-bold text-3xl"
                style={{ color: teamColors[team.name]?.secondary }}
              >
                {team.name}
              </h2>
              <div className="flex items-center gap-8">
                <p className="text-white font-semibold text-xl">₹ {team.totalPurse / 100} Cr</p>
                <div className="flex items-center gap-2">
                  <img className="w-8" src={players} alt="" />
                  <p className="text-white font-semibold text-xl">
                    {team.players.length} / {team.maxPlayers}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <img className="w-8" src={foreign} alt="" />
                  <p className="text-white font-semibold text-xl">
                    {team.players.filter((p) => p.isIndian === false).length} /
                    5
                  </p>
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
