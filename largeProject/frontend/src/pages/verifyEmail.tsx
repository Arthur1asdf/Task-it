import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css";
import background from "../Images/sticky note.png";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid or missing verification token.");
        return;
      }

      try {
        const response = await fetch(`http://task-it.works/api/verify-email/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Email verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-fixed bg-center flex justify-center items-center p-4"
      style={{ backgroundImage: "url('https://i.ibb.co/tTnx3jC4/Untitled115-20250325163027.png')" }}
    >
      <div className="relative w-full max-w-2xl flex justify-center">
        <div
          className="relative flex flex-col items-center p-8 rounded-lg max-w-[500px]"
          style={{
            color: "rgb(85, 70, 60)",
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
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: "rgb(85, 70, 60)" }}>
            {status === "verifying" ? "Verifying Email..." : status === "success" ? "Email Verified!" : "Error"}
          </h2>

          <p
            className="text-lg mb-4 text-center"
            style={{
              color: "rgb(85, 70, 60)",
              maxWidth: "375px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {status === "verifying" ? "Please wait while we verify your email..." : status === "success" ? "Your email has been successfully verified!" : errorMessage}
          </p>

          {status === "error" && (
            <div className="text-red-500 text-lg mb-4">{errorMessage}</div>
          )}

          {status === "success" && (
            <div className="text-green-500 text-lg mb-4">Redirecting to Login...</div>
          )}

          <div className="w-full flex justify-center mt-4">
            <button
              className="text-lg font-bold bg-transparent hover:underline px-4 py-2"
              onClick={() => navigate("/login")}
              type="button"
              style={{ color: "rgb(85, 70, 60)" }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;