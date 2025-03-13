import React from "react";
import "../index.css";
const Login = () => {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900')" }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
