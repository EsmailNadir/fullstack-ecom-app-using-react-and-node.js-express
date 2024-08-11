import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios({
            method:'get',
            baseURL:'http://localhost:5001/products',
            url:'products'
            
        })
    
            .then(response => {
                setProducts(response.data);
                
           })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);
    
    const handleAddToCart = async (productId, quantity = 1)  =>{
       const response = await axios.post('http://localhost:5001/cart', {productId, quantity});
    }



    return (
        
             <div>
            {products.map(product => (
                <div key={product._id}>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>{product.price}</p>
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                
            ))}
            
                <button type='submit' onClick={() => handleAddToCart(products._id)}>add to Cart</button>
            </div>
        
    );
}

export default ProductList;
