import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  totalPurse: {
    type: Number,
    default: 5000
  },

  spent: {
    type: Number,
    default: 0
  },

  maxPlayers: {
    type: Number,
    default: 13
  },

  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  }]

}, { timestamps: true });

export default mongoose.model("Team", teamSchema);