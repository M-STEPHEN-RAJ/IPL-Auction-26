import Team from "../models/Team.js";

export const addTeam = async (req, res) => {
  try {

    const teamCount = await Team.countDocuments();

    if (teamCount >= 8) {
      return res.status(400).json({
        message: "Only 8 teams are allowed!"
      });
    }

    const team = new Team(req.body);

    await team.save();

    res.status(201).json({
      message: "Team created successfully!",
      team
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getTeams = async (req, res) => {
  try {

    const teams = await Team.find().populate("players");

    res.json(teams);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};