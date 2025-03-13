import React from "react";

const ForgetUsername = ({ goBack }: { goBack: () => void }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Forgot Username</h2>
      <p>Enter your email to recover your username.</p>
      <input type="email" placeholder="Email" className="border p-2" />
      <button className="block mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={goBack}>
        Go Back
      </button>
    </div>
  );
};

export default ForgetUsername;
