import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const Home: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div
      style={{
        width: "100%",
        height: "100vh", // Full height of the viewport
        backgroundImage: "url('https://media.discordapp.net/attachments/967622742960652298/1353939649650753546/HomeDesktopFull.png?ex=67e422cf&is=67e2d14f&hm=0edd18576dfd3a2cbb7557046e334977adde0cda9a9a9fe4d9f54aeba67eb3f9&=&format=webp&quality=lossless&width=1182&height=665')", // Your image path
        backgroundPosition: "absolute",
        backgroundSize: "cover",
        backgroundAttachment: "fixed", // Makes the background scrollable
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // Positioning context for the button
      }}
    >
      <div
        style={{
          position: "absolute", // Position the button absolutely within the container
          bottom: "20px", // Adjust this value to position it where you like
          right: "20px", // Adjust this value for horizontal positioning
        }}
      >
        <button
          className="text-black font-bold text-lg px-4 py-2 rounded-md "
          onClick={() => navigate("/login")}
          type="button"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Home;
