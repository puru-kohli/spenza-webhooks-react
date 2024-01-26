import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { isTokenExpired } from "../auth/checkAuth";
import { notify } from "../utils/notify";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenExpired()) {
      navigate("/webhooks");
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setusernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (event) => {
    setusernameError("");
    setPasswordError("");
    event.preventDefault();

    // Validate the form.
    if (!username) {
      setusernameError("Username is required.");
    }
    if (!password) {
      setPasswordError("Password is required.");
    }

    // If the form is valid, submit the login request.
    if (username && password) {
      // TODO: Submit the login request.
      const res = await fetch("http://localhost:3000/auth/login", {
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

      const data = await res.json();
      if (res.ok === true) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", username);

        notify("Login successfull!");
        navigate("/webhooks");
      } else {
        notify(data.message, "error");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="username"
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
        <button type="submit">Login</button>
      </form>

      <button
        onClick={() => {
          navigate("/signup");
        }}
      >
        Signup
      </button>
    </div>
  );
};

export default Login;
