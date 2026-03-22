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

    const result = teams.map((team) => {
      const totalPlayers = team.players.length;

      const foreignPlayers = team.players.filter(
        (p) => p.country !== "India",
      ).length;

      const ratingSum = team.players.reduce(
        (sum, p) => sum + (p.rating || 0),
        0,
      );

      const avgRating = totalPlayers ? (ratingSum / 13).toFixed(2) : 0;

      const remaining = team.totalPurse - team.spent;

      return {
        _id: team._id,
        name: team.name,
        avgRating,
        spent: team.spent,
        remaining,
        totalPlayers,
        foreignPlayers,
      };
    });

    res.json(result);
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

    const totalPlayers = team.players.length;

    const ratingSum = team.players.reduce(
      (sum, p) => sum + (p.rating || 0),
      0
    );

    const avgRating = totalPlayers ? (ratingSum / 13).toFixed(2) : 0;

    res.json({
      ...team.toObject(),
      avgRating,
    });
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

    const populatedPlayer = await Player.findById(player._id).populate(
      "soldTo",
      "name",
    );

    const io = req.app.get("io");

    io.emit("playerSold", {
      player: populatedPlayer,
      teamId,
      price,
    });

    res.json({
      message: "Player sold successfully!",
      player: populatedPlayer,
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
        message: "Player not found!",
      });
    }

    if (player.status === "sold") {
      return res.status(400).json({
        message: "Player already sold!",
      });
    }

    player.status = "unsold";

    await player.save();

    const io = req.app.get("io");

    io.emit("playerUnsold", player);

    res.json({
      message: "Player marked as unsold!",
      player,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removePlayerFromTeam = async (req, res) => {
  try {
    const { playerId } = req.body;

    const player = await Player.findById(playerId);

    if (!player || player.status !== "sold") {
      return res.status(400).json({
        message: "Player is not sold!",
      });
    }

    const team = await Team.findById(player.soldTo);

    if (!team) {
      return res.status(404).json({
        message: "Team not found!",
      });
    }

    // remove player from team
    team.players = team.players.filter(
      (p) => p.toString() !== player._id.toString(),
    );

    // decrease spent money
    team.spent -= player.soldPrice;

    await team.save();

    // reset player
    player.status = "available";
    player.soldTo = null;
    player.soldPrice = 0;

    await player.save();

    const updatedPlayer = await Player.findById(playerId);

    const io = req.app.get("io");

    io.emit("playerRemoved", {
      player: updatedPlayer,
    });

    res.json({
      message: "Player removed from team successfully!",
      player: updatedPlayer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetAuction = async (req, res) => {
  try {
    await Player.updateMany(
      {},
      {
        status: "available",
        soldTo: null,
        soldPrice: 0,
      },
    );

    await Team.updateMany(
      {},
      {
        players: [],
        spent: 0,
      },
    );

    const io = req.app.get("io");

    io.emit("auctionReset");

    res.json({
      message: "Auction reset successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
