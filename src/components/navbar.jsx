import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCity, fetchWeatherByLocation } from "../slice/weatherSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(setCity(input.trim()));
      setInput("");
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            fetchWeatherByLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white p-4 text-center rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap justify-center items-center gap-3"
      >
        <input
          type="text"
          placeholder="Enter city..."
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update local state
          className="p-3 rounded-full text-black bg-white placeholder-gray-500 w-60 focus:outline-none shadow-lg transition-all"
        />
        <button
          type="submit"
          className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold transition-all hover:bg-indigo-100 active:scale-95 shadow-md cursor-pointer"
        >
          Search
        </button>
        <button
          type="button"
          onClick={getUserLocation}
          className="bg-white text-pink-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-100 active:bg-pink-300 transition transform active:scale-96 shadow-md cursor-pointer"
        >
          Use My Location
        </button>
      </form>
    </nav>
  );
};

export default Navbar;
