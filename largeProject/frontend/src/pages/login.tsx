import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "../index.css";
import background from "../Images/login wallpaper.png";

const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)"); // Default RGB color

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRgbColor("rgb(85, 70, 60)"); // Regular variable for color
    try {
      const response = await fetch("http://146.190.218.123:5000/api/login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home");
        console.log("Login Successful, redirecting to home page...");
      } else {
        alert("Wrong Username or Password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="h-screen w-full bg-fixed bg-center relative overflow-auto"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute left-[50%] top-[20%] translate-x-[-50%] flex flex-col items-center justify-center"
      >
        <div
          className="w-[90vw] max-w-[500px] h-auto flex flex-col items-center justify-center p-4"
          style={{
            backgroundImage: "url('https://i.ibb.co/CKc322Wc/Untitled118-20250325211747.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            aspectRatio: "16/9",
          }}
        >
          {/* Login Title */}
          <h2 className="text-xl font-bold mb-3 text-center" style={{ color: rgbColor }}>
            Login
          </h2>

          {/* Login Form */}
          <form className="w-3/4 flex flex-col gap-3" onSubmit={handleSubmit}>
            {/* Username Input */}
            <input
              type="username"
              placeholder="Username"
              className="w-full text-left text-sm bg-transparent border-b focus:outline-none px-2"
              style={{ borderColor: rgbColor, color: rgbColor, fontSize: "clamp(12px, 1rem, 24pt)" }}
              onChange={(e) => setUsername(e.target.value)}
            />
            {/* Forgot Username Link */}
            <div className="w-full text-right">
              <button
                className="text-xs hover:underline"
                style={{ color: rgbColor }}
                onClick={() => navigate("/forgetusername")}
                type="button"
              >
                Forgot Username?
              </button>
            </div>

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              className="w-full text-left text-sm bg-transparent border-b focus:outline-none px-2"
              style={{ borderColor: rgbColor, color: rgbColor, fontSize: "clamp(12px, 1rem, 24pt)" }}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Forgot Password Link */}
            <div className="w-full text-right">
              <button
                className="text-xs hover:underline"
                style={{ color: rgbColor }}
                onClick={() => navigate("/forgetpassword")}
                type="button"
              >
                Forgot Password?
              </button>
            </div>

            {/* Button Container */}
            <div className="w-full flex justify-between mt-3">
              {/* Enter Button */}
              <button
                type="submit"
                className="text-sm font-bold bg-transparent hover:underline w-full sm:w-[48%]"
                style={{ color: rgbColor, fontSize: "clamp(12px, 1rem, 24pt)" }}
              >
                Enter
              </button>

              {/* Sign Up Button */}
              <button
                className="text-sm font-bold bg-transparent hover:underline w-full sm:w-[48%]"
                onClick={() => navigate("/signup")}
                type="button"
                style={{ fontSize: "clamp(12px, 1rem, 24pt)" }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
