import React from 'react'

const CardPage = ({ producttitle, productimage, productdic, productprice }) => {

  const BASE_URL = "http://miralbackend.venuspaneliya.live/"
  
  return (
    <div>
      <div className="card rounded-xl w-[350px]">
        <img src={BASE_URL+productimage?.slice(1)} className="card-img-top w-[70px] h-[70px] rounded-full mx-auto line-clamp-2" alt={productimage} />
        <div className="card-body space-y-2">
          <h5 className="card-title">{producttitle}</h5>
          <p className="card-text">{productdic}</p>
          <p className="card-text">Price: {productprice}</p>
          <button type="button" className="bg-blue-500 p-1 text-white rounded px-2">View</button>
          <button type="button" className="bg-green-500 p-1 text-white rounded mx-2 px-2">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default CardPage