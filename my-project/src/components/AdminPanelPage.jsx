import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AdminCardPAge from './shared/AdminCardPage'
import AdminNavbar from './shared/AdminNavbar'
import { TbHttpDelete } from "react-icons/tb";
import { FaEye } from "react-icons/fa";

const AdminPanelPage = () => {

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({})
    const [user, setUser] = useState(null)
    const [userDetails, setUserDetails] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [openCreateProduct, setOpenCreateProduct] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [editProductModle, setEditProductModle] = useState(false)
    const [editProduct, setEditProduct] = useState(null)
    const [lastImage, setLastImage] = useState(null)
    const [isOpenDeleteProduct, setIsOpenDeleteProduct] = useState(false)
    const [isOpenProduct, setIsOpenProduct] = useState(false)
    const [isOpenUser, setIsOpenUser] = useState(false)
    const [isMailMenu, setIsMainMenu] = useState(true)
    const [isOpenDeleteUser, setIsOpenDeleteUser] = useState(false)

    const ref = useRef(null)
    const BASE_URL = "http://miralbackend.venuspaneliya.live/"

    const [editForm, setEditForm] = useState({
        //  id: product._id,
        producttitle: '',
        productdic: '',
        filename: '',
        productprice: '',
        productimage: '',
    })
    // product details
    const [formData, setFormData] = useState({
        producttitle: '',
        productdic: '',
        productprice: '',
    })

    // console.log("editForm ::", editForm.productimage, typeof editForm.productimage, editForm)

    // fetch All Products
    const fetchProducts = async () => {
        try {
            const res = await axios.get(' http://miralbackend.venuspaneliya.live/product/get-all-products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // fetch all user
    const fetchUser = async () => {
        try {
            const res = await axios.get('http://miralbackend.venuspaneliya.live/user/get-all-user')
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user:', error)
        }
    }

    // call the apis
    useEffect(() => {
        fetchProducts()
        fetchUser()
    }, []);

    // delete user
    const handleDeleteUser = async (_id) => {
        try {
            await axios.delete(`http://miralbackend.venuspaneliya.live/user/delete-user/${_id}`)
            alert('User deleted successfully..')
            fetchUser()
            setIsOpenDeleteUser(false)
        } catch (error) {
            console.error('Error deleting user:', error)
        }
    }

    // delete product
    const handleDeleteProduct = async (_id) => {

        console.log("clicked on handleDeleteProducts... ")
        try {
            await axios.delete(` http://miralbackend.venuspaneliya.live/product/delete-product/${_id}`)
            alert('Product deleted successfully..')
            fetchProducts()
            setIsOpenDeleteProduct(false)
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    // add new product
    const handleOnClick = () => setOpenCreateProduct(true);

    // image chnage handler
    const handleFileChange = () => {
        const file = ref.current.files[0];
        // console.log(file);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            // change the state of the file
            setFormData(prevState => ({ ...prevState, filename: file.name, productimage: file }))
            // setFormData.productimage(imageURL)
        }
    };

    // edit image handler
    const handleEditFileChange = () => {
        const file = ref.current.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            if (lastImage) URL.revokeObjectURL(lastImage);

            setLastImage(imageURL);
            setEditForm(prev => ({
                ...prev,
                productimage: file, // this must be a File object
                filename: file.name,
            }));
        }
    };

    // image change
    useEffect(() => {
        return () => {
            if (setFormData.productimage) {
                URL.revokeObjectURL(lastImage);
            }
        };
    }, [setFormData.productimage]);


    // change image effect
    useEffect(() => {
        let objectUrl;

        if (editForm.productimage && typeof editForm.productimage === 'object') {
            objectUrl = URL.createObjectURL(editForm.productimage);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [editForm.productimage]);


    // add new product handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newFormData = new FormData()

        Object.entries(formData).forEach(([key, value]) => newFormData.append(key, value));

        try {
            const res = await axios.post('http://miralbackend.venuspaneliya.live/product/add-new-product', newFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            fetchProducts()
            setOpenCreateProduct(false)
        }
        catch (error) {
            // console.log("Error:", error)
            setErrorMessage(error.response.data.message)
        }


    }

    // update product details
    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = new FormData();

        // Append all fields to FormData
        updatedFormData.append("producttitle", editForm.producttitle);
        updatedFormData.append("productprice", editForm.productprice);
        updatedFormData.append("productdic", editForm.productdic);

        // Only append the file if a new one is selected
        if (editForm.productimage instanceof File) {
            updatedFormData.append("productimage", editForm.productimage);
        }

        try {
            const res = await axios.put(
                `http://miralbackend.venuspaneliya.live/product/update-product/${editForm._id}`,
                updatedFormData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            console.log(" Product updated:", res.data);
            setEditProductModle(false);
            fetchProducts();
        } catch (error) {
            console.error("Update failed:", error);
            setErrorMessage("Error updating product");
        }
    };


    return (

        <div>
            <AdminNavbar
                setIsOpenUser={setIsOpenUser}
                setIsOpenProduct={setIsOpenProduct}
                setIsMainMenu={setIsMainMenu}
            />

            <div className='container'>

                {/* Dashboard model */}
                {isMailMenu && (
                    <div>

                        {/* product */}
                        <div className='my-5'>
                            {/* title */}
                            <h2
                                className='text-[25px] font-semibold'>
                                Products
                            </h2>

                            {/* product card */}
                            <div className='flex gap-4 self-center'>

                                {/* display product list */}
                                <div className="p-4 flex gap-4 max-w-[90wdh] overflow-x-scroll scrollbar-hide rounded-xl">
                                    {products.map((product) => (
                                        <AdminCardPAge
                                            key={product._id}
                                            product={product}
                                            setProduct={setProduct}
                                            setEditProduct={setEditProduct}
                                            producttitle={product.producttitle}
                                            productimage={product.productimage}
                                            productdic={product.productdic}
                                            productprice={product.productprice}
                                            setEditProductModle={setEditProductModle}
                                            setEditForm={setEditForm}
                                            setIsOpenDeleteProduct={setIsOpenDeleteProduct}
                                        />
                                    ))}
                                </div>

                                {/* add new product button */}
                                <button
                                    onClick={
                                        handleOnClick
                                    }
                                    className='min-w-[250px] h-[200px] border border-black border-dashed my-auto rounded-xl'
                                >
                                    Add new product
                                </button>
                            </div>
                        </div>


                        {/* user */}
                        <div>
                            {/* title */}
                            <h2
                                className='text-[25px] font-semibold'>
                                Users
                            </h2>

                            {/* user card */}
                            <div className="p-4 grid grid-cols-1 gap-5">
                                {
                                    user && user.filter((user) => user.role === 'user').map((user) => (
                                        <div key={user._id} className="bg-white p-4 rounded-md shadow-md space-y-5 w-[]">
                                            <h2 className="text-lg font-bold">{user.username}</h2>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <p className="text-sm text-gray-600">Role: {user.role}</p>
                                            <div className="flex items-center gap-5">
                                                <button
                                                    className='text-[20px]'
                                                    // className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded "
                                                    onClick={
                                                        () => {
                                                            setModalOpen(true);
                                                            setUserDetails(user)
                                                        }
                                                    }
                                                >
                                                    {/* view more */}
                                                    <FaEye />
                                                </button>
                                                <button className='bg-red-600 text-white text-[25px] p-1 px-1.5 rounded-md'
                                                    onClick={() => {
                                                        setIsOpenDeleteUser(true)
                                                        setUserDetails(user)

                                                    }}
                                                >
                                                    <TbHttpDelete />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                )}

                {/* Product Model */}
                {isOpenProduct && (
                    <div>
                        <div className='flex gap-4 self-center'>

                            {/* display product list */}
                            <div className="p-4 grid grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <AdminCardPAge
                                        key={product._id}
                                        product={product}
                                        setProduct={setProduct}
                                        setEditProduct={setEditProduct}
                                        producttitle={product.producttitle}
                                        productimage={product.productimage}
                                        productdic={product.productdic}
                                        productprice={product.productprice}
                                        setEditProductModle={setEditProductModle}
                                        setEditForm={setEditForm}
                                        setIsOpenDeleteProduct={setIsOpenDeleteProduct}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* User model */}
                {isOpenUser && (
                    <div>
                        <div className="p-4 grid grid-cols-1 gap-5">
                            {
                                user && user.filter((user) => user.role === 'user').map((user) => (
                                    <div key={user._id} className="bg-white p-4 rounded-md shadow-md space-y-5 w-[100%]">
                                        <h2 className="text-lg font-bold">{user.username}</h2>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-sm text-gray-600">Role: {user.role}</p>
                                        <div className="flex items-center gap-5">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded "
                                                onClick={
                                                    () => {
                                                        setModalOpen(true)
                                                        setUserDetails(user)
                                                    }
                                                }
                                            >
                                                {/* view more */}
                                                <FaEye />

                                            </button>
                                            <button className='bg-red-600 text-white text-[25px] p-1 px-1.5 rounded-md'
                                                onClick={() => {
                                                    setIsOpenDeleteUser(true)
                                                    setUserDetails(user)
                                                }}
                                            >
                                                <TbHttpDelete />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}



                {/* models */}

                {/* user details model */}
                {modalOpen && userDetails && (
                    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-black bg-opacity-60">
                        <div className="bg-gray-900 text-white border border-gray-700 min-w-[300px] flex-col p-5 rounded-xl shadow-lg space-y-4">

                            <div className="flex justify-center">
                                <img
                                    src={BASE_URL + userDetails.profileimage}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full object-cover border border-gray-500"
                                />
                            </div>

                            <h2 className="text-xl font-bold text-center">{userDetails.username}</h2>
                            <p className="text-center text-gray-300 text-sm">Email: {userDetails.email}</p>
                            <p className="text-center text-gray-400 text-sm">Role: {userDetails.role}</p>

                            <button
                                className="bg-red-600 hover:bg-red-700 text-white py-2 w-full rounded-md"
                                onClick={() => setModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* add new product model */}
                {openCreateProduct && (
                    <div className='fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-opacity-75  bg-black'>
                        <div className='bg-white p-[20px] rounded-[20px]'>
                            <div>
                                <h1 className=' text-[25px] text-center font-semibold'> Add new Product</h1>
                                <form
                                    onSubmit={handleFormSubmit}
                                    className='flex flex-col mt-5 space-y-3'>

                                    {/* Product image */}
                                    <div className='flex justify-center items-center'>
                                        <div onClick={() => ref.current.click()} className="cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={ref}
                                                name='productimage'
                                                id='productimage'
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />

                                            <img
                                                src={formData.productimage ? URL.createObjectURL(formData.productimage) : './user_profile.png'}
                                                alt="Product Image"
                                                className="h-[100px] w-full rounded-xl object-fill border border-black border-dashed"
                                            />
                                        </div>

                                    </div>

                                    {/* Product name */}
                                    <div className='flex py-2 gap-2 justify-between'>
                                        <label className='text-lg'> Name:</label>
                                        <input
                                            type="text"
                                            name="producttitle"
                                            id='producttitle'
                                            value={formData.producttitle}
                                            onChange={(e) => setFormData({ ...formData, producttitle: e.target.value })}
                                            className="w-[250px] px-[10px] border border-black rounded-md"
                                        />
                                    </div>

                                    {/* Product Discription */}
                                    <div className='flex py-2 gap-2 justify-between'>
                                        <label className='text-lg'>Discription:</label>
                                        <textarea
                                            type="text"
                                            name="productdic"
                                            id='productdic'
                                            value={formData.productdic}
                                            onChange={(e) => setFormData({ ...formData, productdic: e.target.value })}
                                            className="w-[250px] px-[10px] border border-black rounded-md row-span-1"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Product Price */}
                                    <div className='flex py-2 gap-2 justify-between'>
                                        <label className='text-lg text-nowrap'>Price:</label>
                                        <input
                                            type="number"
                                            name="productprice"
                                            id='productprice'
                                            value={formData.productprice}
                                            onChange={(e) => setFormData({ ...formData, productprice: e.target.value })}
                                            className="px-[10px] border border-black rounded-md w-[250px]"
                                        />
                                    </div>


                                    {/* submit button */}
                                    <button
                                        type="submit"
                                        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none'
                                    >
                                        Add Product
                                    </button>

                                    {
                                        errorMessage &&
                                        <p className='text-center text-red-500 font-semibold'>{errorMessage}</p>
                                    }

                                    <button
                                        className='bg-red-500 w-full hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none'
                                        onClick={() =>
                                            setOpenCreateProduct(false)
                                        }
                                    >
                                        close
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* edit product details */}
                {editProductModle && editProduct && editForm && (
                    <div className='fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-opacity-75  bg-black'>

                        {/* product name */}
                        <div className='bg-white p-4 rounded shadow-lg'>
                            {/* <h2 className='text-lg text-red-950'>
                                {editProduct.producttitle}
                            </h2> */}
                            <div>
                                <h1 className=' text-[25px] text-center font-semibold'> Edit Product</h1>
                                <p>{editForm._id}</p>
                                <form
                                    onSubmit={handleEditFormSubmit}
                                    className='flex flex-col mt-5 space-y-3'>

                                    {/* Product image */}
                                    <div className='flex justify-center items-center'>
                                        <div onClick={() => ref.current.click()} className="cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={ref}
                                                name='productimage'
                                                id='productimage'
                                                // value={editForm.productimage}
                                                onChange={handleEditFileChange}
                                                accept="image/*"
                                            />

                                            <img
                                                src={(typeof editForm?.productimage) !== "string" ? URL.createObjectURL(editForm.productimage) : BASE_URL + editForm.productimage?.slice(1)}
                                                // URL.createObjectURL(formData.productimage)
                                                alt="Product Image"
                                                className="h-[100px] w-full rounded-xl object-fill border border-black border-dashed"
                                            />
                                        </div>

                                    </div>

                                    {/* Product name */}
                                    <div className='flex py-2 gap-2 justify-between'>
                                        <label className='text-lg'> Name:</label>
                                        <input
                                            type="text"
                                            name="producttitle"
                                            id='producttitle'
                                            value={editForm.producttitle}
                                            onChange={(e) => setEditForm({ ...editForm, producttitle: e.target.value })}
                                            className="w-[250px] px-[10px] border border-black rounded-md"
                                        />
                                    </div>

                                    {/* Product Discription */}
                                    <div className='flex py-2 gap-2 justify-between'>
                                        <label className='text-lg'>Discription:</label>
                                        <textarea
                                            type="text"
                                            name="productdic"
                                            id='productdic'
                                            value={editForm.productdic}
                                            onChange={(e) => setEditForm({ ...editForm, productdic: e.target.value })}
                                            className="w-[250px] px-[10px] border border-black rounded-md row-span-1"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Product Price */}
                                    <div className='flex py-2 gap-2 justify-between'>
                                        <label className='text-lg text-nowrap'>Price:</label>
                                        <input
                                            type="number"
                                            name="productprice"
                                            id='productprice'
                                            value={editForm.productprice}
                                            onChange={(e) => setEditForm({ ...editForm, productprice: e.target.value })}
                                            className="px-[10px] border border-black rounded-md w-[250px]"
                                        />
                                    </div>


                                    {/* submit button */}
                                    <button
                                        type="submit"
                                        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none'
                                    >
                                        Edit Product
                                    </button>

                                    {
                                        errorMessage &&
                                        <p className='text-center text-red-500 font-semibold'>{errorMessage}</p>
                                    }
                                    {/* close button */}
                                    <button
                                        className='bg-red-500 w-full hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none'

                                        onClick={() => setEditProductModle(false)}

                                    >
                                        close
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* conform to delete user  */}
                {isOpenDeleteUser && userDetails && (
                    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px] space-y-4 border border-gray-700">
                            <h2 className="text-xl font-semibold text-center">Delete User</h2>
                            <p className="text-center text-gray-300">
                                Are you sure you want to delete <span className="text-red-400 font-bold">{userDetails.username}</span>?
                            </p>

                            <div className="flex justify-between gap-4 pt-4">
                                <button
                                    onClick={() => setIsOpenDeleteUser(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(userDetails._id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* conformation of delete a product.... */}
                {isOpenDeleteProduct && product && (
                    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px] space-y-4 border border-gray-700">
                            <h2 className="text-xl font-semibold text-center">Delete User</h2>
                            <p className="text-center text-gray-300">
                                Are you sure you want to delete <span className="text-red-400 font-bold">{product.producttitle}</span>?
                            </p>

                            <div className="flex justify-between gap-4 pt-4">
                                <button
                                    onClick={() => setIsOpenDeleteProduct(false)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    // onClick={() => handleNewDeleteProduct(product._id)}
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPanelPage