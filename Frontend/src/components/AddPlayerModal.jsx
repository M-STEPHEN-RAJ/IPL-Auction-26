import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from '../utils/api'

const AddPlayerModal = ({ isOpen, onClose, refreshPlayers }) => {

  const [form, setForm] = useState({
    name: "",
    country: "",
    isIndian: true,
    role: "Batsman",
    basePrice: "",
    image: "",
    rating: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "isIndian" ? value === "true" : value
    });
  };

  const handleSubmit = async () => {
    try {

      await axios.post(
        `${BASE_URL}/players/add`,
        form,
        { withCredentials: true }
      );

      toast.success("Player added successfully");

      refreshPlayers();
      onClose();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding player");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 w-96 space-y-4">

        <h2 className="text-xl font-bold">Add Player</h2>

        <input
          name="name"
          placeholder="Player Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="country"
          placeholder="Country"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="isIndian"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="true">Indian</option>
          <option value="false">Foreign</option>
        </select>

        <select
          name="role"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Batsman</option>
          <option>Bowler</option>
          <option>All-Rounder</option>
          <option>Wicket-Keeper</option>
        </select>

        <input
          name="basePrice"
          type="number"
          placeholder="Base Price"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="rating"
          type="number"
          placeholder="Rating"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-3 pt-2">

          <button
            onClick={onClose}
            className="px-4 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-[#38365B] text-white rounded"
          >
            Add Player
          </button>

        </div>

      </div>

    </div>
  );
};

export default AddPlayerModal;