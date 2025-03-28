import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import background from "../Images/HomeDesktop/home background 2.png";
import furniture from "../Images/HomeDesktop/HomeDesktopFurniture.png";
import calender from "../Images/HomeDesktop/calender.png";
import lamp from "../Images/HomeDesktop/HomeDesktopLamp.png";
import logout from "../Images/HomeDesktop/logout.png";

const Home: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleStickyNoteClick = () => {
    navigate("/note"); // Navigate when clicking the sticky note
  };

  const handleCalendarClick = () => {
    navigate("/calendar"); // Navigate when clicking the calendar
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Sticky Note Container - Scales & Moves with Zoom */}
      <div
        style={{
          position: "absolute",
          top: "15%", // Position relative to the background
          left: "79%",
          width: "15vw", // Scales with viewport width
          maxWidth: "200px", // Prevents it from growing too large
          minWidth: "90px", // Prevents it from shrinking too small
          transform: "translate(-50%, -50%)", // Centers the sticky note
        }}
      >
        <img
          src={logout} // Logout button
          alt="Sticky Note"
          onClick={handleStickyNoteClick}
          style={{
            width: "60%", // Adjusts dynamically with parent div
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Calendar Container - Similar styling to the logout button */}
      <div
        style={{
          position: "absolute",
          top: "77%", // Adjust position to where you want the calendar
          left: "60%",
          width: "20vw", // Increased size for better visibility
          maxWidth: "300px", // Allows a larger maximum size
          minWidth: "120px", // Prevents it from shrinking too much
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={calender} // Calendar button
          alt="Calendar"
          onClick={handleCalendarClick}
          style={{
            width: "120%", // Increased size for better visibility
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
