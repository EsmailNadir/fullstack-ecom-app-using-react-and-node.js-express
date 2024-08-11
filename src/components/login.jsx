import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState({
    loginEmail: "",
    loginPassword: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value);
    setLoginError((prevErrors) => ({
      ...prevErrors,
      loginEmail: e.target.value ? "" : "Email is required",
    }));
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
    setLoginError((prevErrors) => ({
      ...prevErrors,
      loginPassword: e.target.value ? "" : "Password is required",
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError((prevErrors) => ({
        ...prevErrors,
        loginEmail: !loginEmail ? "Email is required" : "",
        loginPassword: !loginPassword ? "Password is required" : "",
      }));
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/login",
        { email: loginEmail, password: loginPassword }
      );
      console.log("Login successful:", response.data);

      if (response.data.token) {
        console.log("Token received:", response.data.token);
        // console.log('UserId received:', response.data.userId);
        localStorage.setItem("token", response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        console.log("Decoded Token:", decodedToken);
        console.log(decodedToken.userId);
        //localStorage.setItem("userId", response.data.userId); // Store the userId in localStorage
        console.log(
          "Token stored in localStorage:",
          localStorage.getItem("token")
        );
        //console.log('UserId stored in localStorage:', localStorage.getItem('userId'));
        navigate("/");
        if (decodedToken && decodedToken.userId) {
          try {
            localStorage.setItem("userId", decodedToken.userId);
            console.log(
              "UserId stored in localStorage:",
              localStorage.getItem("userId")
            );
            navigate("/");
          } catch (error) {
            console.error("Error storing userId in localStorage:", error);
          }
        } else {
          console.error(
            "UserId not received or decoded:",
            response.data.userId,
            decodedToken.userId
          );
        }
      }
    } catch (error) {
      console.log("Error during login:", error);
      setLoginError((prevErrors) => ({
        ...prevErrors,
        general: `Login failed: ${
          error.response?.data?.message || "Please try again."
        }`,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="login-sheet" onSubmit={handleLoginSubmit}>
        <label>
          Email:
          <input
            type="text"
            value={loginEmail}
            onChange={handleLoginEmailChange}
            aria-invalid={loginError.loginEmail ? "true" : "false"}
            aria-describedby="loginEmailError"
          />
          {loginError.loginEmail && (
            <p id="loginEmailError" className="error">
              {loginError.loginEmail}
            </p>
          )}
        </label>
        <label>
          Password:
          <input
            type="password"
            value={loginPassword}
            onChange={handleLoginPasswordChange}
            aria-invalid={loginError.loginPassword ? "true" : "false"}
            aria-describedby="loginPasswordError"
          />
          {loginError.loginPassword && (
            <p id="loginPasswordError" className="error">
              {loginError.loginPassword}
            </p>
          )}
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
        {loginError.general && <p className="error">{loginError.general}</p>}
      </form>
    </div>
  );
}

export default Login;
