import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BASE_URL from "../utils/api";
import dropdownIcon from "../assets/dropdown.png";

const roles = ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"];

const EditPlayerModal = ({ isOpen, onClose, refreshPlayers, player }) => {
  const [form, setForm] = useState({
    name: "",
    country: "",
    isIndian: true,
    role: "Batsman",
    basePrice: "",
    image: "",
    rating: "",
  });

  const [saving, setSaving] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && player) {
      setForm({
        name: player.name || "",
        country: player.country || "",
        isIndian: player.isIndian ?? true,
        role: player.role || "Batsman",
        basePrice: player.basePrice || "",
        image: player.image || "",
        rating: player.rating || "",
      });
    }
  }, [isOpen, player]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      const lower = value.trim().toLowerCase();

      const isIndianPlayer = lower === "india" || lower === "ind";

      setForm({
        ...form,
        country: value,
        isIndian: isIndianPlayer,
      });

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const selectRole = (role) => {
    setForm({
      ...form,
      role: role,
    });

    setRoleOpen(false);
  };

  const handleSubmit = async () => {
    const { name, country, role, basePrice, image, rating } = form;

    if (!name || !country || !role || !basePrice || !image || rating === "") {
      toast.error("Please fill all fields!");
      return;
    }

    if (Number(rating) < 0 || Number(rating) > 10) {
      toast.error("Invalid Rating!");
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `${BASE_URL}/players/update`,
        {
          playerId: player._id,
          ...form,
        },
        { withCredentials: true },
      );

      toast.success("Player updated successfully");

      refreshPlayers();
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating player!");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      country: "",
      isIndian: true,
      role: "Batsman",
      basePrice: "",
      image: "",
      rating: "",
    });
    setRoleOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3 sm:px-0">
      <div className="bg-white px-6 py-5 rounded-xl w-full max-w-lg space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Player</h3>

          <div
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer"
          >
            ✕
          </div>
        </div>

        {form.image && (
          <div className="flex justify-center">
            <img
              src={form.image}
              alt="player"
              className="w-30 h-30 object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm">Player Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="px-2 py-1 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm">Country</label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              className="px-2 py-1 border border-gray-300 rounded-md outline-none"
            />

            <span
              className={`text-xs font-medium ${
                form.isIndian ? "text-green-600" : "text-red-500"
              }`}
            >
              {form.isIndian ? "Indian Player" : "Foreign Player"}
            </span>
          </div>

          <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
            <label className="text-gray-500 text-sm">Role</label>

            <div
              onClick={() => setRoleOpen(!roleOpen)}
              className="px-2 py-1 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
            >
              {form.role}

              <img
                src={dropdownIcon}
                alt=""
                className={`w-4 transition-transform ${
                  roleOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {roleOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 z-20">
                {roles.map((role) => (
                  <div
                    key={role}
                    onClick={() => selectRole(role)}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm">Base Price</label>
            <input
              name="basePrice"
              type="number"
              value={form.basePrice}
              onChange={handleChange}
              className="px-2 py-1 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="px-2 py-1 border border-gray-300 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm">Rating</label>
            <input
              name="rating"
              type="number"
              value={form.rating}
              onChange={handleChange}
              className="px-2 py-1 border border-gray-300 rounded-md outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 text-sm pt-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-1.5 border text-[#38365B] border-[#38365B] rounded-md font-medium cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-42 px-4 py-1.5 bg-[#38365B] text-white rounded-md flex items-center justify-center disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Update Player"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerModal;
