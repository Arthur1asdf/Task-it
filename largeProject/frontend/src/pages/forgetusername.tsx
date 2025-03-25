import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const ForgetUsername: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState(""); // State for email input
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)"); // Default RGB color

  // Handle form submission (for demonstration purposes, you can integrate your API here)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRgbColor("rgb(85, 70, 60)"); // Keep color

    try {
      // API call to trigger sending username functionality
      console.log("Your username was sent to:", email);

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
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://i.ibb.co/5gPp8JnX/Untitled115-20250320155538.png')" }}
    >
      {/* Box to group all elements */}
      <div
        className="absolute left-[50%] top-[28%] translate-x-[-50%] flex flex-col items-center bg-[#EFDAAE] p-8 rounded-lg w-full sm:w-96 lg:w-[400px]"
        style={{
          color: rgbColor,
        }}
      >
        {/* Forget Username Title */}
        <h2 className="text-4xl font-bold mb-2 text-center" style={{ color: rgbColor }}>
          Forgot Username
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
          Enter your email address and we will send you your username
        </p>

        {/* Username reset form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="w-full flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full text-left text-2xl bg-transparent border-b focus:outline-none px-2"
              style={{
                borderColor: rgbColor,
                maxWidth: "350px",
                width: "100%",
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Continue Button */}
          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="text-2xl font-bold bg-transparent hover:underline px-4 py-2"
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
            className="text-2xl font-bold bg-transparent hover:underline px-4 py-2"
            onClick={() => navigate("/login")}
            type="button"
            style={{ color: rgbColor }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetUsername;
