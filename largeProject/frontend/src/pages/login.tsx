import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "../index.css";

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
        console.log("Wrong Username or Password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://i.ibb.co/qL38wPB9/5339046-C-951-A-4339-8-FD9-E82-A1-C511504.png')" }}>
      <div
        className="absolute left-[50%] top-[22%] translate-x-[-50%] flex flex-col items-center justify-center"
        style={{ color: rgbColor }}
      >
        {/* Login Box */}
        <div className="bg-[rgb(238,225,199)] bg-opacity-80 p-10 rounded-lg shadow-lg w-full sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[450px]">
          {/* Login Title */}
          <h2 className="text-4xl font-bold mb-4 text-center" style={{ color: rgbColor }}>
            Login
          </h2>

          {/* Login Form */}
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Username Input */}
            <input
              type="username"
              placeholder="Username"
              className="w-full text-left text-2xl bg-transparent border-b focus:outline-none px-2"
              style={{ borderColor: rgbColor, color: rgbColor }}
              onChange={(e) => setUsername(e.target.value)}
            />
            {/* Forgot Username Link */}
            <div className="w-full text-right">
              <button
                className="text-sm hover:underline"
                style={{ color: rgbColor}}
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
              className="w-full text-left text-2xl bg-transparent border-b focus:outline-none px-2"
              style={{ borderColor: rgbColor, color: rgbColor }}
              onChange={(e) => setPassword(e.target.value)}
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

            {/* Button Container */}
            <div className="w-full flex justify-between mt-4">
  {/* Enter Button */}
  <button
    type="submit"
    className="text-2xl font-bold bg-transparent hover:underline w-full sm:w-[48%]"
    style={{ color: rgbColor }}
  >
    Enter
  </button>

  {/* Sign Up Button */}
  <button
    className="text-2xl font-bold bg-transparent hover:underline w-full sm:w-[48%]"
    onClick={() => navigate("/signup")}
    type="button"
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
