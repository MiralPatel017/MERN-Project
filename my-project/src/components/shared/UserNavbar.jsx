import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';

const UserNavbar = () => {
    // const [cookies, setCookie, removeCookie] = useCookies(['token']);
    // const navigate = useNavigate();
    // const [cookieData, setCookieData] = useState(null);
    // const BASE_URL = "https://miralbackend.venuspaneliya.live/";

    // // Fetch user data from the backend when the component mounts or cookies change
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             // Get user ID from cookies
    //             const userId = cookies?.user?._id;

    //             if (!userId) {
    //                 console.error('User ID not found in cookies');
    //                 return;
    //             }

    //             // Fetch user data from the server
    //             const { data } = await axios.get(`${BASE_URL}user/get-user/${userId}`, {
    //                 withCredentials: true
    //             });

    //             // Log and set the fetched user data
    //             console.log('Fetched user data:', data);
    //             setCookieData(data);
    //         } catch (error) {
    //             console.error('Error fetching user:', error);
    //         }
    //     };

    //     // Only fetch the user if token and user ID are present in cookies
    //     if (cookies.token && cookies.user?._id) {
    //         fetchUser();
    //     } else {
    //         console.log('No token or user ID in cookies');
    //     }
    // }, [cookies.token, cookies.user]);

    // // Logout function to clear cookies and navigate to home page

    const handleLogout = () => {
        removeCookie('token');
        removeCookie('user');
        navigate('/');
    };

    // console.log('Cookie Data:', cookieData);


    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies(['token']);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cookieUser, setCookieUser] = useState(null);
    const [userData, setUserData] = useState({
        _id: '',
        username: '',
        email: '',
        profileimage: '',
        role: ''
    });

    const BASE_URL = 'https://miralbackend.venuspaneliya.live/';



    useEffect(() => {
        const userInfo = cookies.token && JSON.parse(atob(cookies.token.split('.')[1]));
        if (userInfo) {
            // console.log('userinfo :',userInfo)
            setCookieUser(userInfo);
        }
    }, [cookies]);

    useEffect(() => {
        if (cookieUser && cookieUser._id) {
            const fetchUserData = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}user/get-user/${cookieUser._id}`, {
                        withCredentials: true
                    });
                    setUserData(res.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, [cookieUser]);

    // console.log('cookie data : ', cookieUser)
    // console.log('user data : ', userData)
    return (
        <nav className="bg-gray-900 fixed text-white py-4 flex justify-between items-center container">
            <div className="text-xl font-semibold">User Dashboard</div>
            <div className="flex items-center gap-4">
                {userData ? (
                    <div className="relative group">
                        {cookies.token ?
                            <>
                                <div className="flex items-center cursor-pointer space-x-2">
                                    <img
                                        src={
                                            userData?.profileimage
                                                ? BASE_URL + userData.profileimage
                                                : BASE_URL + userData.profileimage
                                        }
                                        alt="User"
                                        className="w-11 h-11 rounded-full border-[1.6px] p-[1px] border-white object-cover"
                                    />
                                    {/* <User size={20} /> */}
                                </div>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition duration-300 z-20">
                                    <Link to="/user/profile" className="block px-4 py-2 hover:bg-gray-700 rounded">Profile</Link>
                                    <Link to="/user/settings" className="block px-4 py-2 hover:bg-gray-700 rounded">Settings</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 hover:bg-red-600 rounded hover:text-white text-red-400"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                            :
                            <div>

                                <Link to='/' className='border-[2px] border-white rounded-[5px] px-[10px] py-[5px] font-semibold'>
                                    sign in
                                </Link>
                            </div>
                        }
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </nav>
    );
};

export default UserNavbar;
