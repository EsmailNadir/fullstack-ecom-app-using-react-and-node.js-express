import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    userName: '',
    password: '',
    email: '',
    confirmPassword: ''
  });

  const handleUserName = (e) => {
    setUserName(e.target.value);
    setError(prevErrors => ({
      ...prevErrors,
      userName: e.target.value === '' ? 'Username is required' : ''
    }));
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setError(prevErrors => ({
      ...prevErrors,
      password: e.target.value === '' ? 'Password is required' : ''
    }));
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setError(prevErrors => ({
      ...prevErrors,
      email: e.target.value === '' ? 'Email is required' : ''
    }));
  };

  const handleConfirm = (e) => {
    setConfirmPassword(e.target.value);
    setError(prevErrors => ({
      ...prevErrors,
      confirmPassword:
        e.target.value === '' ? 'Confirmation password is required' :
        e.target.value !== password ? 'Passwords do not match' : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (userName === '') newErrors.userName = 'Username is required';
    if (password === '') newErrors.password = 'Password is required';
    if (email === '') newErrors.email = 'Email is required';
    if (confirmPassword === '') newErrors.confirmPassword = 'Confirmation password is required';
    if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
    } else {
      setLoading(true);
      try {
        await axios.post('http://localhost:5001/api/users/signup', { username: userName, password, email });
        setUserName('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setError({
          userName: '',
          password: '',
          confirmPassword: '',
          email: ''
        });
        alert('Signup successful!');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(`Signup failed: ${error.response.data.message}`);
        } else {
          alert('Signup failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 mx-auto text-center flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl mb-6">Create an Account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              id="username"
              className="w-full px-5 py-2 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Username"
              type="text"
              value={userName}
              onChange={handleUserName}
              aria-invalid={error.userName ? "true" : "false"}
              aria-describedby="userNameError"
            />
            {error.userName && <p id="userNameError" className="mt-1 text-red-500 text-sm">{error.userName}</p>}
          </div>

          <div className="flex flex-col">
            <input
              id="password"
              className="w-full px-5 py-2 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={handlePassword}
              aria-invalid={error.password ? "true" : "false"}
              aria-describedby="passwordError"
            />
            {error.password && <p id="passwordError" className="mt-1 text-red-500 text-sm">{error.password}</p>}
          </div>

          <div className="flex flex-col">
            <input
              id="email"
              className="w-full px-5 py-2 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={handleEmail}
              aria-invalid={error.email ? "true" : "false"}
              aria-describedby="emailError"
            />
            {error.email && <p id="emailError" className="mt-1 text-red-500 text-sm">{error.email}</p>}
          </div>

          <div className="flex flex-col">
            <input
              id="confirmPassword"
              className="mb-5 w-full px-5 py-2 text-gray-700 border rounded-lg focus:outline-none"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirm}
              aria-invalid={error.confirmPassword ? "true" : "false"}
              aria-describedby="confirmPasswordError"
            />
            {error.confirmPassword && <p id="confirmPasswordError" className="mt-1 text-red-500 text-sm">{error.confirmPassword}</p>}
          </div>

          <div className="text-sm text-gray-500 mb-5">
            By creating an account, you agree to our terms & conditions and privacy policy.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-2 px-5 rounded-md border border-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            {loading ? 'Submitting...' : 'Sign Up'}
          </button>
          
          <div className="mt-4">
            <Link className="text-black text-xl" to="/login">Or Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
