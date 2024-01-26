import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../auth/checkAuth";
import { notify } from "../utils/notify";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenExpired()) {
      navigate("/webhooks");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form.
    if (!username) {
      setUsername("Name is required.");
    }
    if (!password) {
      setPasswordError("Password is required.");
    }

    // If the form is valid, submit the signup request.
    if (username && password) {
      // TODO: Submit the signup request.
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          // Add parameters here
          username,
          password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (res.ok === true) {
        notify("User created successfully!");
        navigate("/login");
      } else {
        const data = await res.json();
        notify(data.message, "error");
      }
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
