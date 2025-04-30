import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const navigate = useNavigate();

    const [cookieUser, setCookieUser] = useState(null);
    const token = localStorage.getItem("token")
    const [userData, setUserData] = useState({
        _id: '',
        username: '',
        email: '',
        profileimage: '',
        role: ''
    });

    const [selectedImage, setSelectedImage] = useState(null);

    const fileRef = useRef(null);

    // cookie handler
    useEffect(() => {
        const token = localStorage.getItem("token")
        const userInfo = token && JSON.parse(atob(token.split('.')[1]));
        if (userInfo) {
            // console.log("user info :", userInfo)
            setCookieUser(userInfo);
        }
    }, []);

    // store cookie data 
    useEffect(() => {
        if (cookieUser && cookieUser._id) {

            fetchUserData();
        }
    }, [cookieUser]);

    
    const BASE_URL = 'https://ecom-backend-production-66e4.up.railway.app/';

    // fetch user handler
    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}user/get-user/${cookieUser._id}`, {
                withCredentials: true
            });
            // console.log("responce ", res.data)
            setUserData(res.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    // image change handler
    const handleImageChange = () => {
        const file = fileRef.current.files[0];
        if (file) {
            setSelectedImage(file);
            setUserData(prev => ({
                ...prev,
                profileimage: file,
                filename: file.name
            }));
        }
    };

    // change value 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    // updat handler
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", userData.username);
        formData.append("email", userData.email);
        if (selectedImage) {
            formData.append("profileimage", selectedImage);
        }

        try {
            const res = await axios.put(`${BASE_URL}user/update-user/${userData._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            console.log("Update response:", res.data);

            alert('Profile updated successfully!');
            fetchUserData()
            // setUserData(prev => ({
            //     ...prev,
            //     ...res.data
            // }));
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
            alert("Failed to update profile.");
        }
    };


    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
                <form onSubmit={handleUpdate} className="space-y-4">

                    <div className="flex justify-center">
                        <div onClick={() => fileRef.current.click()} className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileRef}
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <img
                                src={selectedImage ? URL.createObjectURL(selectedImage) : BASE_URL + userData.profileimage.slice(1)}
                                alt="User Profile"
                                className="w-24 h-24 rounded-full border-2 border-white object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Role</label>
                        <input
                            type="text"
                            value={userData.role}
                            disabled
                            className="w-full px-3 py-2 bg-gray-600 text-white rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                    >
                        Update Profile
                    </button>

                    <button
                        type='button'
                        onClick={() => navigate('/home-page')}
                        className='bg-gray-600 hover:bg-gray-700 w-full py-2 rounded'
                    >
                        Back to Home
                    </button>

                    <button
                        type='button'
                        onClick={handleLogout}
                        className='bg-red-600 hover:bg-red-700 w-full py-2 text-white rounded'
                    >
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;
