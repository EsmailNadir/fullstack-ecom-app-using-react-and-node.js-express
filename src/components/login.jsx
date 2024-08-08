import { useState } from "react";
import axios from "axios";

function Login() {
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

            if (response.data.token && response.data.userId) {
                console.log('Token received:', response.data.token);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId); // Store the userId in localStorage
                console.log('Token stored in localStorage:', localStorage.getItem('token'));
                console.log('UserId stored in localStorage:', localStorage.getItem('userId'));
                window.location.href = '/';
            } else {
                setLoginError(prevErrors => ({ ...prevErrors, general: 'No token or userId received from server.' }));
            }
        } catch (error) {
            console.log('Error during login:', error);
            setLoginError(prevErrors => ({ ...prevErrors, general: `Login failed: ${error.response?.data?.message || 'Please try again.'}` }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form className="login-sheet" onSubmit={handleLoginSubmit}>
                <label>
                    Email:
                    <input type="text" value={loginEmail} onChange={handleLoginEmailChange} aria-invalid={loginError.loginEmail ? "true" : "false"} aria-describedby="loginEmailError" />
                    {loginError.loginEmail && <p id="loginEmailError" className="error">{loginError.loginEmail}</p>}
                </label>
                <label>
                    Password:
                    <input type="password" value={loginPassword} onChange={handleLoginPasswordChange} aria-invalid={loginError.loginPassword ? "true" : "false"} aria-describedby="loginPasswordError" />
                    {loginError.loginPassword && <p id="loginPasswordError" className="error">{loginError.loginPassword}</p>}
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                {loginError.general && <p className="error">{loginError.general}</p>}
            </form>
        </div>
    );
}

export default Login;
