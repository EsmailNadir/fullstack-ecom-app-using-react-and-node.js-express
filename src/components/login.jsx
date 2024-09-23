import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { decodeJwt } from 'jose';
import LoginContext from './context/loginContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(LoginContext); // Get the login function from context
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState({
    loginEmail: '',
    loginPassword: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value);
    setLoginError(prevErrors => ({ ...prevErrors, loginEmail: e.target.value ? '' : 'Email is required' }));
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
    setLoginError(prevErrors => ({ ...prevErrors, loginPassword: e.target.value ? '' : 'Password is required' }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError(prevErrors => ({
        ...prevErrors,
        loginEmail: !loginEmail ? 'Email is required' : '',
        loginPassword: !loginPassword ? 'Password is required' : '',
      }));
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/users/login', { email: loginEmail, password: loginPassword });
      console.log('Login successful:', response.data);

      if (response.data.token) {
        console.log('Token received:', response.data.token);
        // Use the login function from context
        login(response.data.token);

        const decodedToken = decodeJwt(response.data.token);
        console.log('Decoded Token:', decodedToken);

        if (decodedToken && decodedToken.userId) {
          localStorage.setItem('userId', decodedToken.userId);
          console.log('UserId stored in localStorage:', localStorage.getItem('userId'));
        } else {
          console.error('UserId not received or decoded:', decodedToken.userId);
        }

        // Navigate after setting state
        navigate('/products');
      } else {
        console.error('Token not received');
      }
    } catch (error) {
      console.log('Error during login:', error);
      setLoginError(prevErrors => ({ ...prevErrors, general: `Login failed: ${error.response?.data?.message || 'Please try again.'}` }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleLoginSubmit}>
          <h1 className="text-xl text-center mb-6">Login</h1>
          <div className="mb-4">
            <input
              placeholder="Email"
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
              type="email"
              value={loginEmail}
              onChange={handleLoginEmailChange}
              aria-invalid={loginError.loginEmail ? "true" : "false"}
              aria-describedby="loginEmailError"
            />
            {loginError.loginEmail && <p id="loginEmailError" className="text-red-500 text-xs mt-1">{loginError.loginEmail}</p>}
          </div>

          <div className="mb-6">
            <input
              placeholder="Password"
              className="mb-4 w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
              type="password"
              value={loginPassword}
              onChange={handleLoginPasswordChange}
              aria-invalid={loginError.loginPassword ? "true" : "false"}
              aria-describedby="loginPasswordError"
            />
            {loginError.loginPassword && <p id="loginPasswordError" className="text-red-500 text-xs mt-1">{loginError.loginPassword}</p>}
          </div>

          <div>
            <button
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>

          {loginError.general && <p className="text-red-500 text-xs text-center mt-4">{loginError.general}</p>}
          <div className="mt-5">
            <Link className="text-black text-xl" to="/signup">Or Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
