import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import background from "../Images/sticky note.png";

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRgbColor("rgb(85, 70, 60)");

    try {
      const response = await fetch("http://146.190.218.123:5000/api/forgot-password/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Password reset link sent to:", email);
        alert("If this email is registered, a reset link will be sent.");
      } else {
        alert(data.error || "Failed to send reset link");
      }
  
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
          }}
        >
          <h2 className="text-3xl font-bold mb-2 text-center">Forgot Password</h2>
          <p className="text-lg mb-4 text-center">
            Enter your email address and we will send you instructions to reset your password
          </p>

          <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="w-full flex justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-3/4 text-left text-lg bg-transparent border-b focus:outline-none px-2"
                style={{ borderColor: rgbColor }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w-full flex justify-center mt-4">
              <button
                type="submit"
                className="text-lg font-bold bg-transparent hover:underline px-4 py-2"
                style={{ color: rgbColor }}
              >
                Continue
              </button>
            </div>
          </form>

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

export default ForgetPassword;
