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
    setRgbColor("rgb(85, 70, 60)"); // Keep color

    try {
      const response = await fetch("http://146.190.218.123:5000/api/register/register", {
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
      style={{ backgroundImage: "url('https://i.ibb.co/qL38wPB9/5339046-C-951-A-4339-8-FD9-E82-A1-C511504.png')" }}
    >
      <div className="absolute inset-x-0 top-[20%] flex items-center justify-center"> {/* Adjusted top value */}
        <div
          className="bg-[rgb(238,225,199)] bg-opacity-80 p-8 rounded-lg shadow-lg w-full sm:w-96 lg:w-1/3 xl:w-[450px]"
          style={{
            color: rgbColor,
          }}
        >
          <h2 className="text-4xl font-bold mb-4 text-center" style={{ color: rgbColor }}>
            Sign Up
          </h2>

          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full text-left text-2xl bg-transparent border-b focus:outline-none px-2"
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
              className="w-full text-left text-2xl bg-transparent border-b focus:outline-none px-2"
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
                className="w-full text-left text-2xl bg-transparent border-b focus:outline-none px-2"
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
                className="absolute top-[250px] center bg-white p-6 shadow-lg w-[380px] rounded-lg left-1/2 transform -translate-x-1/2"
                style={{ display: password ? "block" : "none" }}
              >
                <h3 className="font-semibold text-lg mb-2">Password Requirements</h3>
                <div className={`flex items-center ${requirements.length ? "text-green-500" : "text-red-500"}`}>
                  {requirements.length ? "✔️" : "❌"} Minimum 8 characters
                </div>
                <div className={`flex items-center ${requirements.uppercase ? "text-green-500" : "text-red-500"}`}>
                  {requirements.uppercase ? "✔️" : "❌"} At least one uppercase letter
                </div>
                <div className={`flex items-center ${requirements.lowercase ? "text-green-500" : "text-red-500"}`}>
                  {requirements.lowercase ? "✔️" : "❌"} At least one lowercase letter
                </div>
                <div className={`flex items-center ${requirements.number ? "text-green-500" : "text-red-500"}`}>
                  {requirements.number ? "✔️" : "❌"} At least one number
                </div>
              </div>
            </div>
            {passwordError && <p className="text-red-500 text-center mt-2 text-lg">{passwordError}</p>} {/* Show error message */}
            <div className="w-full flex justify-center gap-4 mt-4">
              <button
                className="text-2xl font-bold bg-transparent hover:underline"
                onClick={goToLogin}
                type="button"
              >
                Log In
              </button>
              <button
                type="submit"
                className="text-2xl font-bold bg-transparent hover:underline"
                style={{
                  color: rgbColor,
                }}
                disabled={!!passwordError} // Disable the button if there's a password error
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

export default SignUp;
