import React, { useState } from "react";

const AuthComponent = ({ setCurrentUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = "http://localhost:8000" + (isLogin ? "/login" : "/register");

    const requestBody = {
      username,
      password,
      // Include passwordRepeat only for registration
      ...(isLogin ? {} : { passwordRepeat }),
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API request failed:", errorData);
        // Handle error appropriately (e.g., show an error message to the user)
        return;
      }

      // Handle successful response (e.g., redirect, update state, etc.)
      const responseData = await response.json();
      console.log("API request succeeded:", responseData);

      if (responseData) {
        setCurrentUser(responseData);
      }
      // Reset form fields
      //   setUsername("");
      //   setPassword("");
      //   setPasswordRepeat("");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // Handle unexpected errors appropriately
    }
  };

  return (
    <div className="w-96 mx-auto mt-20 p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between mb-4">
        <span
          className={`p-2 cursor-pointer ${
            isLogin ? "border-b-2 border-black" : ""
          }`}
          onClick={handleToggle}>
          Login
        </span>
        <span
          className={`p-2 cursor-pointer ${
            !isLogin ? "border-b-2 border-black" : ""
          }`}
          onClick={handleToggle}>
          Register
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Username:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password:
          </label>
          <input
            type="password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Repeat Password:
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
          </div>
        )}
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
            {isLogin ? "Login" : "Register"}
          </button>
        </div>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span className="text-blue-500 cursor-pointer" onClick={handleToggle}>
          {isLogin ? "Register now" : "Login now"}
        </span>
      </p>
    </div>
  );
};

export default AuthComponent;
