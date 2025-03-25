import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [rgbColor, setRgbColor] = useState("rgb(85, 70, 60)");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRgbColor("rgb(85, 70, 60)");

    try {
      console.log("Password reset link sent to:", email);
      alert("If this email is registered, a reset link will be sent.");
      navigate("/login");
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
            backgroundImage: "url('https://cdn.discordapp.com/attachments/903014510376398889/1354211028518305884/Untitled115_20250325175046.png?ex=67e476cd&is=67e3254d&hm=4f3a65384c9159a39555b9ea54c43356d08a081a98a218c916300fbf045f5cd0&')", // Set the image here
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
