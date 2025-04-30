import React, { useEffect, useState } from 'react'
import CardPage from './shared/CardPage'
import axios from 'axios'

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null)


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(' https://ecom-backend-production-66e4.up.railway.app/product/get-all-products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };


    const fetchUser = async () => {
      try {
        const res = await axios.get('https://ecom-backend-production-66e4.up.railway.app/user/get-all-user')
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchProducts()
    fetchUser()
  }, []);

  return (
    <div>
      
      {/* product card */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-[100px] container">
        {products.sort(() => Math.random() - 0.5).slice(0, 10).map((product) => (
          <div key={product._id} className='mx-auto'>
            <CardPage
              producttitle={product.producttitle}
              productimage={product.productimage}
              productdic={product.productdic}
              productprice={product.productprice}
            />
          </div>
        ))}
      </div>


      {/* modle */}
      {/* {
        modalOpen && (
          <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden">
            <div className="bg-gray-300 border border-black min-w-[300px] flex-col p-4 rounded-md shadow-lg space-y-5">
              <img src={userDetails.profileimage} alt="" />
              <h2 className="text-lg font-bold">{userDetails.username}</h2>
              <p className="text-sm text-gray-600">{userDetails.email}</p>
              <p className="text-sm text-gray-600">Role: {userDetails.role}</p>
              <button
                className='bg-red-600 text-white p-2 rounded-md'
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )
      } */}
    </div>
  );
}

export default HomePage