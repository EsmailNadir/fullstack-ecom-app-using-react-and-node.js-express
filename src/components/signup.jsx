import { useState } from "react";
import axios from "axios";

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
        if (e.target.value === '') {
            setError(prevErrors => ({ ...prevErrors, userName: 'Username is required' }));
        } else {
            setError(prevErrors => ({ ...prevErrors, userName: '' }));
        }
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
        if (e.target.value === '') {
            setError(prevErrors => ({ ...prevErrors, password: 'Password is required' }));
        } else {
            setError(prevErrors => ({ ...prevErrors, password: '' }));
        }
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
        if (e.target.value === '') {
            setError(prevErrors => ({ ...prevErrors, email: 'Email is required' }));
        } else {
            setError(prevErrors => ({ ...prevErrors, email: '' }));
        }
    };

    const handleConfirm = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value === '') {
            setError(prevErrors => ({ ...prevErrors, confirmPassword: 'Confirmation password is required' }));
        } else if (e.target.value !== password) {
            setError(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
        } else {
            setError(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
        }
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
            console.log('Form submitted', { userName, password, email, confirmPassword });
            try {
                await axios.post('http://localhost:5001/api/users/signup', { username: userName,password, email }); 
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
                console.log('error during signup:', error);
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
        <div className="Signup-sheet">
            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        className="signup-username"
                        type="text"
                        value={userName}
                        onChange={handleUserName}
                        aria-invalid={error.userName ? "true" : "false"}
                        aria-describedby="userNameError"
                    />
                    {error.userName && <p id="userNameError" className="error">{error.userName}</p>}
                </label>
                <label className="password-signup">
                    Password
                    <input
                        className="signup-password"
                        type="password"
                        value={password}
                        onChange={handlePassword}
                        aria-invalid={error.password ? "true" : "false"}
                        aria-describedby="passwordError"
                    />
                    {error.password && <p id="passwordError" className="error">{error.password}</p>}
                </label>
                <label>
                    Email
                    <input
                        className="signup-email"
                        type="email"
                        value={email}
                        onChange={handleEmail}
                        aria-invalid={error.email ? "true" : "false"}
                        aria-describedby="emailError"
                    />
                    {error.email && <p id="emailError" className="error">{error.email}</p>}
                </label>
                <label>
                    Confirm Password
                    <input
                        className="password-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirm}
                        aria-invalid={error.confirmPassword ? "true" : "false"}
                        aria-describedby="confirmPasswordError"
                    />
                    {error.confirmPassword && <p id="confirmPasswordError" className="error">{error.confirmPassword}</p>}
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            </form>
        </div>
    );
}

export default Signup;
