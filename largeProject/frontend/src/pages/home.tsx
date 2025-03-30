import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import background from "../Images/HomeDesktop/home background 2.png";
import furniture from "../Images/HomeDesktop/HomeDesktopFurniture.png";
import calender from "../Images/HomeDesktop/calender.png";
import lamp from "../Images/HomeDesktop/HomeDesktopLamp.png";
import logout from "../Images/HomeDesktop/logout.png";

const Home: React.FC = () => {
  const navigate = useNavigate(); // Use navigate instead of window.location

  const goToLogin = () => navigate("/login");
  const goToCalender = () => navigate("/calender");
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
          top: "15%", 
          left: "79%",
          width: "15vw",
          maxWidth: "200px",
          minWidth: "90px", 
          transform: "translate(-50%, -50%)", 
        }}
      >
        <img
          src={logout} // Logout button
          alt="Sticky Note"
          onClick={goToLogin}
          style={{
            width: "60%",
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Calendar Container - Similar styling to the logout button */}
      <div
        style={{
          position: "absolute",
          top: "77%",
          left: "60%",
          width: "20vw", 
          maxWidth: "300px",
          minWidth: "120px", 
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={calender}
          alt="Calendar"
          onClick={goToCalender}
          style={{
            width: "120%",
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
