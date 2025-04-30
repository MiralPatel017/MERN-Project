import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const AdminPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://miralbackend.venuspaneliya.live/user/admin-signin', formData, {
        withCredentials: true
      })
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        navigate('/panel-page');
      }

    } catch (error) {

      setErrorMessage(error.response.data.message)
    }
  };


  return (
    <div className="h-[100vh] flex items-center justify-center">
      <div className=' p-[20px] border border-black rounded-lg '>
        <div>
          <h1 className='text-3xl font-bold text-center'>Sign In</h1>
          <form
            onSubmit={handleSubmitData}
            // method='post'
            // action=
            className='flex flex-col mt-5 space-y-3'>

            {/* email */}
            <div className='flex py-2 gap-2'>
              <label className='text-lg'>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-[10px] border border-black rounded-md"
              />
            </div>

            {/* password */}
            <div className='flex py-2 gap-2'>
              <label className='text-lg'>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-[10px] border border-black rounded-md"
              />
            </div>


            {/* submit button */}
            <button
              type="submit"
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none'
            >
              Sign In
            </button>

            <p className='text-center text-sm mt-5'>
              Don't have an account? <Link to="/register" className=' text-[blue] font-semibold'> Signup </Link>
            </p>


            {/* error message */}
            {
              errorMessage &&
              <p className='text-center text-red-500 font-semibold'>{errorMessage}</p>
            }
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminPage