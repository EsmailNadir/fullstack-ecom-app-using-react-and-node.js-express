import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProductAbout() {
  const [productAbout, setProductAbout] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      console.log("Fetching product with ID:", productId);
      const response = await axios.get(`http://localhost:5001/api/products/${productId}`);
      console.log("Response data:", response.data);
      setProductAbout(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error.response || error);
    }
  };

  if (!productId) {
    return <div className="text-center text-red-500">No product ID provided</div>;
  }

  if (!productAbout) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold mb-6">{productAbout.name}</h1>
      <div className="flex flex-col items-center text-center">
        <img
          className="w-full max-w-md h-auto mb-6 rounded"
          src={productAbout.imageUrl}
          alt={productAbout.name}
        />
        <div className="mb-6">
          <button
            onClick={() => onAddToCart(productAbout._id)}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Add to Cart
          </button>
        </div>
        <div className="text-lg max-w-2xl">
          <p>{productAbout.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductAbout;
