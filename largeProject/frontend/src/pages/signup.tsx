import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added navigation
import "../index.css";

const SignUp = () => {
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const navigate = useNavigate(); // Use navigate instead of window.location

  const goToLogin = () => navigate("/login");
  const goToHome = () => navigate("/home");

  // Password complexity validation (without special characters)
  const validatePassword = (password: string) => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /\d/.test(password);

    // Update requirements state
    setRequirements({
      length,
      uppercase,
      lowercase,
      number,
    });

    if (length && uppercase && lowercase && number) {
      setPasswordError("");
      return true;
    } else {
      setPasswordError("Password must meet all the requirements.");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from refreshing on form submission

    if (!validatePassword(password)) {
      return; // Don't submit if password is invalid
    }

    console.log("I HANDLING THINGS");
    try {
      const response = await fetch("http://146.190.218.123:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username: username, Email: email, Password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Success!");
        goToHome(); // Redirect to home after successful registration
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
      style={{ backgroundImage: "url('https://i.ibb.co/21hGpH7M/Login-Door.png')" }}
    >
      <div
        className="absolute left-[50%] top-[22%] translate-x-[-50%] flex flex-col items-center"
        style={{
          color: rgbColor,
        }}
      >
        <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: rgbColor }}>
          Sign Up
        </h2>

        <form className="w-full flex flex-col gap-1" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
            style={{
              borderColor: rgbColor,
              color: rgbColor,
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
            style={{
              borderColor: rgbColor,
              color: rgbColor,
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-full">
            <input
              type="password"
              placeholder="Password"
              className="w-full text-left text-lg bg-transparent border-b focus:outline-none px-2"
              style={{
                borderColor: rgbColor,
                color: rgbColor,
              }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />

            {/* Larger popup to the side for password requirements */}
            <div
              className="absolute top-[-90px] right-[-450px] bg-white p-6 shadow-lg w-[300px] rounded-lg"
              style={{ display: password ? "block" : "none" }}
            >
              <h3 className="font-semibold text-lg mb-2">Password Requirements</h3>
              <div
                className={`flex items-center ${requirements.length ? "text-green-500" : "text-red-500"}`}
              >
                {requirements.length ? "✔️" : "❌"} Minimum 8 characters
              </div>
              <div
                className={`flex items-center ${requirements.uppercase ? "text-green-500" : "text-red-500"}`}
              >
                {requirements.uppercase ? "✔️" : "❌"} At least one uppercase letter
              </div>
              <div
                className={`flex items-center ${requirements.lowercase ? "text-green-500" : "text-red-500"}`}
              >
                {requirements.lowercase ? "✔️" : "❌"} At least one lowercase letter
              </div>
              <div
                className={`flex items-center ${requirements.number ? "text-green-500" : "text-red-500"}`}
              >
                {requirements.number ? "✔️" : "❌"} At least one number
              </div>
            </div>
          </div>

          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} {/* Show error message */}

          <div className="w-full flex justify-center mt-2">
            <button
              type="submit"
              className="text-lg font-bold bg-transparent hover:underline"
              style={{
                color: rgbColor,
              }}
              disabled={!!passwordError} // Disable the button if there's a password error
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="w-full flex justify-center mt-2">
          <button
            className="text-black font-bold text-lg px-4 py-2 rounded-md shadow-lg transform rotate-3 hover:rotate-0 transition-all"
            style={{
              fontFamily: "'Patrick Hand', cursive",
              backgroundColor: "#FAEC91",
              boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
            }}
            onClick={goToLogin}
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
