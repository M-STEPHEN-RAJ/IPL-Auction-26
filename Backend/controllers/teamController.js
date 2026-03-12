import Team from "../models/Team.js";
import Player from "../models/Player.js";

export const addTeam = async (req, res) => {
  try {
    const teamCount = await Team.countDocuments();

    if (teamCount >= 8) {
      return res.status(400).json({
        message: "Only 8 teams are allowed!",
      });
    }

    const team = new Team(req.body);

    await team.save();

    res.status(201).json({
      message: "Team created successfully!",
      team,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players");

    res.json(teams);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");

    if (!team) {
      return res.status(404).json({
        message: "Team not found!",
      });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const buyPlayer = async (req, res) => {
  try {
    const { teamId, playerId, price } = req.body;

    const team = await Team.findById(teamId);
    const player = await Player.findById(playerId);

    if (!team || !player) {
      return res.status(404).json({
        message: "Team or Player not found!",
      });
    }

    if (player.status === "sold") {
      return res.status(400).json({
        message: "Player already sold!",
      });
    }

    if (price < player.basePrice) {
      return res.status(400).json({
        message: "Player cannot be sold below base price!",
      });
    }

    if (team.spent + price > team.totalPurse) {
      return res.status(400).json({
        message: "Not enough purse!",
      });
    }

    if (team.players.length >= team.maxPlayers) {
      return res.status(400).json({
        message: "Max players reached!",
      });
    }

    if (!player.isIndian) {
      const foreignPlayers = await Player.countDocuments({
        soldTo: team._id,
        isIndian: false,
      });

      if (foreignPlayers >= 5) {
        return res.status(400).json({
          message: "Foreign player limit reached!",
        });
      }
    }

    team.players.push(player._id);

    team.spent += price;

    await team.save();

    player.status = "sold";
    player.soldTo = team._id;
    player.soldPrice = price;

    await player.save();

    res.json({
      message: "Player sold successfully!",
      team,
      player,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markUnsold = async (req, res) => {
  try {

    const { playerId } = req.body;

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({
        message: "Player not found!"
      });
    }

    if (player.status === "sold") {
      return res.status(400).json({
        message: "Player already sold!"
      });
    }

    player.status = "unsold";

    await player.save();

    res.json({
      message: "Player marked as unsold!",
      player
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};