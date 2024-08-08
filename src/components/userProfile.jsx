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
                'authorization': `Bearer ${token}`
        }
        
        }
        const userData={
        username,
        email,
        newPassword,
        currentPassword,
        };
        try{
            const response = await axios.put('http://localhost:5001/api/users/me',userData,config)
            setSuccess('profile updated successfully');
        }catch (error){
            setError('error updating profile')
        }finally{
            setLoading(false);
        }
        
        

    }

   
    return <div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <h1>userProfile</h1>
        <form className="userProfile" onSubmit={handleFormSubmit}>
            <label>
                username
            <input 
            type="text"
            onChange={handleUserNameChange}
            value={username}
            />

            </label>
            <label>
                email
            <input 
            type="email"
            onChange={handleEmailChange}
            value={email}
            />
            </label>
            <label>
               currentPassword
            <input 
            type="password"
            onChange={handleCurrentPasswordChange}
            value={currentPassword}
            />

            </label>

            
            <label>
               change password
            <input 
            type="password"
            onChange={handleNewPasswordChange}
            value={newPassword}
            />

            </label>
            <label>
               confirmNewPassword
            <input 
            type="password"
            onChange={handleConfirmPasswordChange}
            value={confirmNewPassword}
            />

            </label>
            <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            
            </form> 
    </div>
}

export default UserProfile;