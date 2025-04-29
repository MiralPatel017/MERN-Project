import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        filename: '',
        password: '',
        profileimage: '',
    })
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState("")
    const ref = useRef(null)

    const handleFileChange = () => {
        const file = ref.current.files[0];
        if (file) {
            setFormData(prevState => ({ ...prevState, profileimage: file }))
        }
    }
    

    // create new user handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newFormData = new FormData()

        Object.entries(formData).forEach(([key, value]) => newFormData.append(key, value));

        try {
            const res = await axios.post('http://localhost:5713/user/signup', newFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            navigate('/')
        }
        catch (error) {
            setErrorMessage(error.response.data.message)
            // console.log(error)
        }
    }


    return (
        <div className="h-[100vh] flex items-center justify-center">
            <div className='p-[20px] w-auto border border-black h-auto rounded-lg'>
                <div>
                    <h1 className='text-3xl font-bold text-center'>Sign up</h1>
                    <form
                        onSubmit={handleFormSubmit}
                        className='flex flex-col mt-5 space-y-3'>


                        {/* user Profile image */}
                        <div className='flex justify-center items-center'>
                            <div onClick={() => ref.current.click()} className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={ref}
                                    name='profileimage'
                                    id='profileimage'
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />

                                <img
                                    // src={formData.profileimage || './user_profile.png'}
                                    src={formData.profileimage ? URL.createObjectURL(formData.profileimage) : './user_profile.png'}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border border-black"
                                />
                            </div>

                        </div>

                        {/* username */}
                        <div className='flex py-2 gap-2 justify-between'>
                            <label className='text-lg'>Name:</label>
                            <input
                                type="text"
                                name="username"
                                id='username'
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-[250px] px-[10px] border border-black rounded-md"
                                required
                            />
                        </div>

                        {/* email */}
                        <div className='flex py-2 gap-2 justify-between'>
                            <label className='text-lg'>Email:</label>
                            <input
                                type="email"
                                name="email"
                                id='email'
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-[250px] px-[10px] border border-black rounded-md"
                                required
                            />
                        </div>

                        {/* password */}
                        <div className='flex py-2 gap-2 justify-between'>
                            <label className='text-lg text-nowrap'>Create password:</label>
                            <input
                                type="password"
                                name="password"
                                id='password' 
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="px-[10px] border border-black rounded-md w-[250px]"
                                required
                            />
                        </div>


                        {/* submit button */}
                        <button
                            type="submit"
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none'
                        >
                            Sign up
                        </button>

                        <p className='text-center text-sm mt-5'>
                            You have already account ? <Link to="/" className=' text-[blue] font-semibold'> Signin </Link>
                        </p>

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

export default SignupPage