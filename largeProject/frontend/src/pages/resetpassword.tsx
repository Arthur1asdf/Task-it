import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css";
import background from "../Images/sticky note.png";


const ResetPassword: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)"); // Default RGB color
  const [passwordError, setPasswordError] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

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


  // Handle form submission (for demonstration purposes, you can integrate your API here)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRgbColor("rgb(85, 70, 60)");
  
    if (password !== conPassword) {
      alert("Passwords don't match!");
      return;
    }
  
    if (!validatePassword(password)) {
      return;
    }
  
    try {
      const response = await fetch(`http://146.190.218.123:5000/api/reset-password/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Password reset successful! Redirecting to login...");
        navigate("/login");
      } else {
        alert(`Error: ${data.error || "Could not reset password"}`);
      }
    } catch (error) {
      console.error("Reset error:", error);
      alert("Something went wrong. Please try again.");
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

              <div className="relative w-full">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full text-left text-sm bg-transparent border-b focus:outline-none px-2"
                  style={{
                    borderColor: rgbColor,
                    color: rgbColor,
                    fontSize: "clamp(12px, 1rem, 24pt)"
                  }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                />

                <div className="w-full flex justify-center">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full text-left text-sm bg-transparent border-b focus:outline-none px-2"
                      style={{ 
                        borderColor: rgbColor, 
                        color: rgbColor, 
                        fontSize: "clamp(12px, 1rem, 24pt)" }}
                      onChange={(e) => setConPassword(e.target.value)}
                    />
                  </div>

                {/* Larger popup to the side for password requirements */}
                <div
                  className="absolute top-[50px] center bg-white p-6 shadow-lg w-[380px] rounded-lg -translate-x-120"
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
