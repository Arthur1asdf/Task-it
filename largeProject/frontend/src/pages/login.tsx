import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "../index.css";

const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  // State for RGB color
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)"); // Default RGB color

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevents the page from refreshing on form submission
  
      try {
        const response = await fetch('http://146.190.218.123:5000/api/login', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "Username": username, "Password": password}),
        });
  
        const data = await response.json();
      
        if (response.ok) {
            localStorage.setItem("token", data.token);
            console.log(data);
            alert("Success!");
        } else {
            alert(data.message || "Error occurred");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong");
    }
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
        {/* Login Title */}
        <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: rgbColor }}>
          Login
        </h2>

        {/* Login Form */}
        <form className="w-full flex flex-col gap-1">
          {/* Email Input */}
          <input
            type="username"
            placeholder="Username"
            className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
            style={{
              borderColor: rgbColor,
              color: rgbColor,
            }}
          />
          {/* Forgot Username Link */}
          <div className="w-full text-right">
            <button
              className="text-sm hover:underline"
              style={{ color: rgbColor }}
              onClick={() => navigate("/forgetusername")} // Navigate to Forget Username
              type="button"
            >
              Forgot Username?
            </button>
          </div>

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
          {/* Forgot Password Link */}
          <div className="w-full text-right">
            <button
              className="text-sm hover:underline"
              style={{ color: rgbColor }}
              onClick={() => navigate("/forgetpassword")} // Navigate to Forget Password
              type="button"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* Enter Button */}
        <div className="w-full flex justify-center mt-2">
          <button 
          type="submit" 
          className="text-lg font-bold bg-transparent hover:underline" 
          style={{ color: rgbColor }}
          onClick={() => navigate("/home")}>
            Enter
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
            onClick={() => navigate("/signup")} // Navigate to Sign Up
            type="button"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;



