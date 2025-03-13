import React, { useState } from "react";
import "../index.css";

const SignUp = () => {
  // State for RGB color
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)"); // Default RGB color (like your #55463C)

  // Functions to handle navigation
  const goToLogin = () => {
    window.location.href = "login.tsx"; // Redirects to login page
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://i.ibb.co/21hGpH7M/Login-Door.png')" }} // Use your actual image path
    >
      {/* Invisible Box to group all elements */}
      <div
        className="absolute left-[50%] top-[22%] translate-x-[-50%] flex flex-col items-center"
        style={{ color: rgbColor }}
      >
        {/* Sign Up Title */}
        <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: rgbColor }}>
          Sign Up
        </h2>

        {/* Sign Up Form */}
        <form className="w-full flex flex-col gap-1">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
            style={{
              borderColor: rgbColor,
              color: rgbColor,
            }}
          />
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
            style={{
              borderColor: rgbColor,
              color: rgbColor,
            }}
          />
          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
            style={{
              borderColor: rgbColor,
              color: rgbColor,
            }}
          />
        </form>

        {/* Submit Button */}
        <div className="w-full flex justify-center mt-2">
          <button type="submit" className="text-lg font-bold bg-transparent hover:underline" style={{ color: rgbColor }}>
            Sign Up
          </button>
        </div>

        {/* Sticky Note Styled Sign-Up Button */}
        <div className="w-full flex justify-center mt-2">
          <button
            className="text-black font-bold text-lg px-4 py-2 rounded-md shadow-lg transform rotate-3 hover:rotate-0 transition-all"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              backgroundColor: "#FAEC91",
              boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
            }}
            onClick={goToLogin} // Redirect to Login
            type="button"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
