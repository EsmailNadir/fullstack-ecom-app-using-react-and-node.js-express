import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
          .get('http://localhost:5001/api/products')
          .then((response) => {
            setProducts(response.data);
            console.log(response.data);  // Log the response data directly
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
          });
      }, []);
    
    const handleAddToCart = async (productId, quantity = 1) => {
        const token = localStorage.getItem("token"); // Ensure the token is retrieved correctly
        try {
            const response = await axios.post(
              "http://localhost:5001/api/cart/add",
              { productId, quantity },
              {
                headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the header
                },
              }
            );
            console.log("Cart updated:", response.data);
          } catch (error) {
            console.error(
              "Error adding to cart:",
              error.response?.data || error.message
            );
          }
    };

    return (
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <img src={product.imageUrl} alt={product.name} />
              <button type="submit" onClick={() => handleAddToCart(product._id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
    );
}

export default ProductList;
