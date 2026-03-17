import Player from "../models/Player.js";

export const addPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);

    await player.save();

    const io = req.app.get("io");

    io.emit("playerAdded", player);

    res.status(201).json({
      message: "Player added successfully!",
      player,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPlayers = async (req, res) => {
  try {
    const { name, status, role, nationality } = req.query;

    const query = {};

    if (status && status !== "all") query.status = status;
    if (role && role !== "all") query.role = role;
    if (nationality && nationality !== "all") {
      query.isIndian = nationality === "indian";
    }
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const players = await Player.find(query).populate("soldTo", "name");

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate("soldTo");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        message: "Player not found",
      });
    }

    if (player.status === "sold") {
      return res.status(400).json({
        message: "Cannot delete a sold player",
      });
    }

    await Player.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");

    io.emit("playerDeleted", { playerId: player._id });

    res.json({
      message: "Player deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const { playerId, ...updateData } = req.body;

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const updatedPlayer = await Player.findByIdAndUpdate(playerId, updateData, {
      new: true,
    });

    const io = req.app.get("io");

    io.emit("playerUpdated", updatedPlayer);

    res.json({
      message: "Player updated successfully!",
      player: updatedPlayer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
