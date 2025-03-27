import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import background from "../Images/HomeDesktop/HomeDesktopBackground.png";
import furniture from "../Images/HomeDesktop/HomeDesktopFurniture.png";
import calender from "../Images/HomeDesktop/HomeDesktopCalender.png";
import lamp from "../Images/HomeDesktop/HomeDesktopLamp.png";
import logout from "../Images/HomeDesktop/HomeDesktopLogout.png";

const Home: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div
      style={{
        width: "100%",
        height: "100vh", // Full height of the viewport
        backgroundImage: `url(${background})`, // Your image path
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
