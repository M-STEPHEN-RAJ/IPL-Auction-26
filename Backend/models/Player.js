import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    isIndian: {
      type: Boolean,
      required: true,
    },

    role: {
      type: String,
      enum: ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"],
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "sold", "unsold"],
      default: "available",
    },

    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },

    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    soldPrice: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Player", playerSchema);
