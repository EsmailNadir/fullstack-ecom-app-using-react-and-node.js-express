import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShoppingCart() {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!userId || !token) {
                    console.error("User ID or token not found in local storage");
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(
                    `http://localhost:5001/api/cart/${userId}`,
                    config
                );
                if (response.data.items) {
                    setCart(response.data.items);
                } else {
                    setCart([]);
                }
                setError(""); // Clear any previous errors on successful fetch
            } catch (error) {
                console.error(error);
                setError("Error fetching cart");
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const handleAddItem = async (productId, quantity = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Error: no token found");
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(
                "http://localhost:5001/api/cart/add",
                { productId, quantity, userId },
                config
            );

            const response = await axios.get(
                `http://localhost:5001/api/cart/${userId}`,
                config
            );
            setCart(response.data.items);
            setError("");
        } catch (error) {
            setError("Error adding item");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Error: no token found");
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const updateResponse = await axios.put(
                `http://localhost:5001/api/cart/update/${itemId}`,
                { quantity: newQuantity },
                config
            );

            setCart(updateResponse.data.cart.items);
            setError("");
        } catch (error) {
            console.error("Error updating quantity:", error);
            setError("Error updating quantity");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Error: no token found");
                setLoading(false);
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(
                `http://localhost:5001/api/cart/remove/${itemId}`,
                config
            );

            const response = await axios.get(
                `http://localhost:5001/api/cart/${userId}`,
                config
            );
            setCart(response.data.items);
            setError("");
        } catch (error) {
            console.error("Error removing item:", error);
            setError("Error removing item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <ul className="list-none p-0">
                {cart.map((item) => (
                    <li
                        key={item._id}
                        className="flex justify-between items-center p-4 mb-4 bg-white rounded-lg shadow"
                    >
                        <div className="flex items-center">
                            <div className="w-32 h-32 rounded-lg overflow-hidden mr-4">
                                <img
                                    src={item.productId.imageUrl}
                                    alt={item.productId.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold">{item.productId.name}</h3>
                                <div className="flex items-center mt-2">
                                    <label htmlFor={`quantity-${item._id}`} className="items-center mr-2">
                                        Quantity:
                                    </label>
                                    <select
                                        id={`quantity-${item._id}`}
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                        className="items-center justify-center p-1 border border-gray-300 rounded bg-white"
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="font-bold mt-2">${(item.productId.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-blue-500 hover:underline"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            {cart.length > 0 && (
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal:</p>
                        <p>${cart.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2)}</p>
                    </div>

                    <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                        <button
                            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShoppingCart;
