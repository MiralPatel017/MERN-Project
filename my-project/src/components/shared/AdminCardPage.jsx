import React, { useState } from 'react'

const AdminCardPAge = ({
    producttitle,
    productimage,
    productdic,
    productprice,
    setEditProductModle,
    setEditProduct,
    product,
    setEditForm,
    setConformDeleteProduct,
    setProduct,
    setNewProductDelete,
    setIsOpenDeleteProduct }) => {
    const BASE_URL = "http://localhost:5713/"

    const handleOnEdit = () => {
        console.log("button clicked...")
        setEditProductModle(true)
        setEditProduct(product)
        setEditForm(product)
        // console.log(product)
    }

    const handleDeleteProduct = () => {
        // setConformDeleteProduct(true)
        // setNewProductDelete(true)
        setIsOpenDeleteProduct(true)
        console.log("clicked delete Button.... now new value is true.... and click from the other components")
        setProduct(product)
    }

    return (
        <div>
            <div className="card rounded-xl w-[300px]">
                <img src={BASE_URL + productimage?.slice(1)} className="card-img-top w-[70px] h-[70px] rounded-full mx-auto line-clamp-2" alt={productimage} />
                <div className="card-body space-y-2">
                    <h5 className="card-title">{producttitle}</h5>
                    <p className="card-text">{productdic}</p>
                    <p className="card-text">Price: {productprice}</p>
                    <button
                        onClick={handleOnEdit}
                        className="bg-blue-500 p-1 text-white rounded px-2"
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 p-1 text-white rounded mx-2 px-2"
                        onClick={handleDeleteProduct}
                    >delete</button>
                </div>
            </div>
        </div>
    )
}

export default AdminCardPAge