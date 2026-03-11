import Player from "../models/Player.js";

export const addPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);

    await player.save();

    res.status(201).json({
      message: "Player added successfully!",
      player
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
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

    const players = await Player.find(query);

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};