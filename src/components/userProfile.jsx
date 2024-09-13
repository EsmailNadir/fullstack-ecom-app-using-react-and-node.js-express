import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import userEvent from '@testing-library/user-event';

function UserProfile(){
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const[currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassowrd] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect (()=>{
        const fetchUserData = async () => {  
           setLoading(true);
           try{
          const token =   localStorage.getItem('token')
          const config = {
            headers:{
                'Authorization' : `Bearer ${token}`
            }
            
          }
          const response = await axios.get('http://localhost:5001/api/users/me', config);
          setUserName(response.data.username);
          setEmail(response.data.email);
          setLoading(false);
           }catch (error) {
            setError('Error fetching user data');
            setLoading(false);
        }
    }
    fetchUserData();
    },[]) 

    

    const handleUserNameChange = (e) =>{
        setUserName(e.target.value);
    }
       
    const handleEmailChange= (e) =>{
        setEmail(e.target.value);
    }

    const handleCurrentPasswordChange= (e) =>{
        setCurrentPassword(e.target.value)
    }

    const handleNewPasswordChange= (e) =>{
        setNewPassowrd(e.target.value);
    }
    
    const handleConfirmPasswordChange= (e) =>{
        setConfirmNewPassword(e.target.value);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        if(newPassword !== confirmNewPassword){
            setError('Passwords do not match')
            setLoading(false);
            return;
        }
        const token = localStorage.getItem('token')
        const config = {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }
        const userData = {
            username,
            email,
            currentPassword,
            newPassword,
        };
        try {
            console.log('Sending update request with data:', userData);
            const response = await axios.put('http://localhost:5001/api/users/me', userData, config)
            console.log('Update response:', response.data);
            setSuccess('Profile updated successfully');
            setCurrentPassword('');
            setNewPassowrd('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Error updating profile:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    }
   
    return <div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="flex items-start py-12 justify-center   min-h-screen bg-gray-100">
        <form className=" items-center  rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleFormSubmit}>
        
                
            
            <label>
            <input 
            className="mb-4 px-3 py-2 text-gray-700 border rounded focus:outline-none"
            placeholder="username"
            type="text"
            onChange={handleUserNameChange}
            value={username}
            />

            </label>
            <label>
                
            <input 
            className="mb-4 px-3 py-2 text-gray-700 border rounded focus:outline-none"
            placeholder="email"
            type="email"
            onChange={handleEmailChange}
            value={email}
            />
            </label>
            <label>
            <input 
            className="mb-4 px-3 py-2 text-gray-700 border rounded focus:outline-none"
            placeholder="currentPassword"
            type="password"
            onChange={handleCurrentPasswordChange}
            value={currentPassword}
            />

            </label>

            
            <label>
            <input 
            className="mb-4 px-3 py-2 text-gray-700 border rounded focus:outline-none"
            placeholder="change password"
            type="password"
            onChange={handleNewPasswordChange}
            value={newPassword}
            />

            </label>
            <label>
            <input 
            className="mb-4 px-3 py-2 text-gray-700 border rounded focus:outline-none"
            placeholder="confirmNewPassword"
            type="password"
            onChange={handleConfirmPasswordChange}
            value={confirmNewPassword}
            />

            </label>
            <button className="w-20 p-2 bg-blue-500 text-white rounded cursor-pointer transition duration-200 hover:bg-blue-700" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            
            </form> 
            </div>
    </div>
    
}

export default UserProfile;