import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AdminProfile = () => {

    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['Token']);
    const [adminData, setAdminData] = useState({
        // id: '',
        username: '',
        email: '',
        filename: '',
        profileimage: '',
        role: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const fileRef = useRef(null);

    // const adminId = '680884b32dab1108a29cae78';
    const BASE_URL = 'http://localhost:5713/';

    // fetching admin data
    const fetchAdminData = async () => {
        try {
            const res = await axios.get(`http://localhost:5713/user/get-admin`, { withCredentials: true });
            setAdminData(res.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    // call api
    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleImageChange = () => {
        const file = fileRef.current.files[0];
        if (file) {
            setSelectedImage(file);
            setAdminData(prev => ({
                ...prev,
                // profileimage: URL.createObjectURL(file)
                profileimage: file,
                filename: file.name
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData(prev => ({ ...prev, [name]: value }));
    };

    // update handler 
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", adminData.username);
        formData.append("email", adminData.email);
        formData.append("profileimage", selectedImage);


        try {
            const res = await axios.put(`http://localhost:5713/user/update-admin/${adminData._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            setAdminData(res.data);

            // console.log("response data :", res.data)
            // console.log("new form data :", formData)
            // console.log("Selected image : ", selectedImage)
            // console.log('admin data :-', adminData)
            // console.log("Objetch URL:- ", URL.createObjectURL(selectedImage))

            fetchAdminData()

            alert('Profile updated successfully!');
        } catch (error) {
            // setAdminData(res.data);
            // fetchAdminData()
            console.error("Error updating profile:", error);
        }
    };

    const handleLogout = () => {
        removeCookie('token');
        navigate('/admin-login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Profile</h1>
                <form onSubmit={handleUpdate} className="space-y-4">

                    {/* profile image  */}
                    <div className="flex justify-center">

                        <div onClick={() => fileRef.current.click()} className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                name='profileimage'
                                id='profileimage'
                                ref={fileRef}
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <img
                                src={selectedImage ? URL.createObjectURL(selectedImage) : BASE_URL + adminData.profileimage}
                                alt="Admin Profile"
                                className="w-24 h-24 rounded-full border-2 border-white object-cover"
                            />
                        </div>
                    </div>

                    {/* user name */}
                    <div>
                        <label className="block text-sm mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={adminData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        />
                    </div>

                    {/* email */}
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={adminData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        />
                    </div>

                    {/* role */}
                    <div>
                        <label className="block text-sm mb-1">Role</label>
                        <input
                            type="text"
                            value={adminData.role}
                            disabled
                            className="w-full px-3 py-2 bg-gray-600 text-white rounded"
                        />
                    </div>

                    {/* update button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                    >
                        Update Profile
                    </button>

                    {/* back to home page button */}
                    <button
                        type='button'
                        onClick={() => navigate('/panel-page')}
                        className='bg-gray-600 hover:bg-gray-700 w-full py-2 rounded mb-3'
                    >
                        Back to Panel
                    </button>

                    {/* logout button */}
                    <button
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

export default AdminProfile;
