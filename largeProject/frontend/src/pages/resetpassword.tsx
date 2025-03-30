import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import background from "../Images/sticky note.png";


const ResetPassword: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)"); // Default RGB color

  // Handle form submission (for demonstration purposes, you can integrate your API here)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRgbColor("rgb(85, 70, 60)"); // Keep color

    if (password == conPassword){
      alert("Passwords match!");
      return;
    }
    else{
      alert("Passwords don't match!");
      return;
    }

    try {
      // API call to trigger sending username functionality
      console.log("Your username was sent to:");

      // Simulating successful username submission
      alert("If this email is registered, an email with your username info will be sent.");
      navigate("/login"); // Redirect back to login page after submission
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-fixed bg-center flex justify-center items-center p-4"
      style={{ backgroundImage: "url('https://i.ibb.co/tTnx3jC4/Untitled115-20250325163027.png')" }}
    >
      <div className="relative w-full max-w-2xl flex justify-center">
        <div
          className="relative flex flex-col items-center p-8 rounded-lg max-w-[500px]"
          style={{
            color: rgbColor,
            zIndex: 2,
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: "6rem",
            width: "100%",
            height: "auto",
          }}
        >
          {/* Forget Username Title */}
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: rgbColor }}>
            Reset Password
          </h2>

          {/* Instructions Line */}
          <p
            className="text-lg mb-4 text-center"
            style={{
              color: rgbColor,
              maxWidth: "375px",
              width: "100%",
              textAlign: "center",
            }}
          >
            Type in your new password
          </p>

          {/* Username reset form */}
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="w-full flex justify-center">
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
                style={{
                  borderColor: rgbColor,
                  maxWidth: "350px", // Ensure input doesn't stretch too wide
                  width: "100%",
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="w-full flex justify-center">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full text-left text-sm bg-transparent border-b focus:outline-none px-2"
                style={{ borderColor: rgbColor, color: rgbColor, fontSize: "clamp(12px, 1rem, 24pt)" }}
                onChange={(e) => setConPassword(e.target.value)}
              />
            </div>

            {/* Continue Button */}
            <div className="w-full flex justify-center mt-4">
              <button
                type="submit"
                className="text-lg font-bold bg-transparent hover:underline px-4 py-2"
                style={{
                  color: rgbColor,
                }}
              >
                Continue
              </button>
            </div>
          </form>

          {/* Back to Login Button with Underline */}
          <div className="w-full flex justify-center mt-4">
            <button
              className="text-lg font-bold bg-transparent hover:underline px-4 py-2"
              onClick={() => navigate("/login")}
              type="button"
              style={{ color: rgbColor }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
