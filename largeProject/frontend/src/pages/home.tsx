import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "../index.css";

const Home: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation


  return (
    <div className="w-full flex justify-center mt-2">
        <button
        className="text-black font-bold text-lg px-4 py-2 rounded-md shadow-lg transform rotate-3 hover:rotate-0 transition-all"
        style={{
            fontFamily: "'Patrick Hand', cursive",
            backgroundColor: "#FAEC91",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
        }}
        onClick={() => navigate("/login")}
        type="button"
        >
        Log out
        </button>
    </div>
  );
};

export default Home;
