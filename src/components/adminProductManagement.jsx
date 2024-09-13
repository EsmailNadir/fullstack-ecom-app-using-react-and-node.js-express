import React, { useState } from 'react';
import axios from "axios";
import {  useEffect } from "react";

function AdminProductManagement() {
    const [products, setProducts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({
        name: '',
        description: '',
        ratings: '',
        price: '',
        imageUrl: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5001/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
                setError("Error fetching products");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleEditProduct = (product) => {
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            ratings: product.ratings,
            imageUrl: product.imageUrl,
        });
        setEditMode(true);
        setCurrentProductId(product._id);
    };

    const handleDeleteProduct = async (productId) => {
        setError('');
        setSuccess('');
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, authorization denied.');
            setLoading(false);
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            } 
        };

        try {
            await axios.delete(`http://localhost:5001/api/products/delete/${productId}`, config);
            setSuccess("Product deleted successfully");
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product", error);
            setError("Error deleting product");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, authorization denied.');
            setLoading(false);
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            if (editMode) {
                await axios.put(`http://localhost:5001/api/products/update/${currentProductId}`, form, config);
                setSuccess('Product updated successfully');
            } else {
                await axios.post('http://localhost:5001/api/products', form, config);
                setSuccess('Product added successfully');
            }
            const response = await axios.get('http://localhost:5001/api/products');
            setProducts(response.data);
            setForm({
                name: '',
                description: '',
                price: '',
                ratings: '',
                imageUrl: '',
            });
            setEditMode(false);
            setCurrentProductId('');
        } catch (error) {
            console.error("Error submitting form", error);
            setError('Error submitting form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">Admin Product Management</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <div className="ProductManagement">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <label>
                        <input
                            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
                            placeholder="Name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        <input
                            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
                            placeholder="Description"
                            name="description"
                            type="text"
                            value={form.description}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        <input
                            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
                            placeholder="Price"
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        <input
                            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
                            placeholder="Rating"
                            name="ratings"
                            type="number"
                            value={form.ratings}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        <input
                            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
                            placeholder="Image URL"
                            name="imageUrl"
                            type="text"
                            value={form.imageUrl}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button 
                        className="w-20 p-2 bg-blue-500 text-white rounded cursor-pointer transition duration-200 hover:bg-blue-700"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {products.map(product => (
                        <li key={product._id} className="bg-white p-4 rounded shadow-md">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-48 object-contain"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-center mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-600 text-center mb-4">
                              {product.description.length > 100 ? 
                                  product.description.substring(0, 100) + '...' : 
                                  product.description}
                            </p>
                            <p className="text-lg font-bold text-center">${product.price}</p>
                            <p className="text-sm text-yellow-500 text-center">Rating: {product.ratings}</p>

                            <div className="flex justify-between mt-4">
                                <button
                                    className=" bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className=" bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
                                    onClick={() => handleDeleteProduct(product._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminProductManagement;
