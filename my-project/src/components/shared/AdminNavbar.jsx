import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import axios from 'axios';

const AdminNavbar = ({ setIsOpenProduct, setIsOpenUser, setIsMainMenu }) => {

    // fetch admin details
    const Token = localStorage.getItem("Token")
    const [admin, setAdmin] = useState({});
    const BASE_URL = "https://ecom-backend-production-66e4.up.railway.app/"

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("Token")
        navigate('/admin-login')
    }

    useEffect(() => {
        // Fetch admin details from API using axios
        axios.get('https://ecom-backend-production-66e4.up.railway.app/user/get-admin')
            .then(response => {
                setAdmin(response.data)
            })
            .catch(error => console.error('Error fetching admin details:', error));
    }, [])
    // console.log("Admin Data: ",admin)

    // open Dashboard
    const handleDashboard = () => {
        setIsMainMenu(true)
        setIsOpenUser(false)
        setIsOpenProduct(false)
    }

    // open Product
    const handleProduct = () => {
        setIsMainMenu(false)
        setIsOpenUser(false)
        setIsOpenProduct(true)
    }

    // open users
    const handleUser = () => {
        setIsMainMenu(false)
        setIsOpenUser(true)
        setIsOpenProduct(false)
    }


    return (
        <nav className="container bg-gray-900 text-white shadow-md py-4 flex items-center justify-between">
            {/* Logo / Brand */}
            <div className="text-2xl font-bold tracking-wide">
                <Link to="/panel-page">AdminPanel</Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">

                {/* Dashboard */}
                <button
                    className="hover:text-gray-300 transition"
                    onClick={handleDashboard}
                >
                    Dashboard
                </button>

                {/* Products */}
                <button
                    className="hover:text-gray-300 transition"
                    onClick={handleProduct}
                >
                    Products
                </button>

                {/* Users */}
                <button
                    className="hover:text-gray-300 transition"
                    onClick={handleUser}
                >
                    Users
                </button>

                {/* Orders */}
                {/* <button
                    className="hover:text-gray-300 transition"
                // onClick={handleOrder}
                >
                    Orders
                </button> */}
            </div>

            {/* Admin Profile */}
            <div className="relative group">
                <div className="flex items-center cursor-pointer space-x-2">
                    <img
                        src={BASE_URL + admin.profileimage}
                        alt="Admin"
                        className="w-10 h-10 rounded-full border border-white object-cover"
                    />
                    {/* <User size={20} /> */}
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition duration-300 z-20">
                    <Link to="/admin/profile" className="block px-4 py-2 hover:bg-gray-700 rounded">Profile</Link>
                    <Link to="/panel-page" className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</Link>
                    <button
                        onClick={handleLogout}
                        className="block px-4 text-start py-2 w-full hover:bg-red-600 rounded hover:text-white text-red-500">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
