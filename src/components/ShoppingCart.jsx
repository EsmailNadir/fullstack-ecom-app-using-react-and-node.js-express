import { useState,useEffect } from "react";
import axios from "axios";

function ShoppingCart() {
    console.log('Cart component rendered');
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        console.log('useEffect hook executed');
        const fetchCart = async () => {
            console.log('Fetching cart...');
            try {
                
                const token = localStorage.getItem("token");
                if (!userId || !token) {
                    console.error('User ID or token not found in local storage');
                    return;
                }
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get(`http://localhost:5001/api/cart/${userId}`, config);
                if (response.data.items) {
                    setCart(response.data.items);
                } else {
                    setCart([]); // Set cart to an empty array if items is undefined
                }
            } catch (error) {
                console.error(error);
                setError('Error fetching cart');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [userId]);
    // Add item to cart
    const handleAddItem = async (productId, quantity) => {
        try {
            const token = localStorage.getItem('token');
            console.log("token",token);
            if(!token){
                setError("error no token found")
                setLoading(false)
                return
            }
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.post('http://localhost:5001/api/cart/add', { productId, quantity }, config);
            // Refresh cart
            const response = await axios.get('http://localhost:5001/api/cart', config);
            console.log('Response:', response);
            setCart(response.data.items);
        } catch (error) {
            setError('Error adding item');
        }
    };

    // Remove item from cart
    const handleRemoveItem = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.delete(`http://localhost:5001/api/cart/remove/${productId}`, config);
            const response = await axios.get('http://localhost:5001/api/cart', config);
            setCart(response.data.items);
        } catch (error) {
            setError('Error removing item');
        }
    };

    return (
        <div>
            <h1>Shopping Cart</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            
            <ul>
                {cart.map(item => (
                    <li key={item.productId._id}>
                        <h2>{item.productId.name}</h2>
                        <p>Quantity: {item.quantity}</p>
                        <button onClick={() => handleRemoveItem(item.productId._id)}>Remove</button>
                        <button onClick={() => handleAddItem(item.productId._id)}>add item</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShoppingCart;
