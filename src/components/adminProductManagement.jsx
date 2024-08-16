import axios from "axios";
import { useState, useEffect } from "react";

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
        console.log("Token for DELETE:", token); // Log the token for debugging
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
            await axios.delete(`http://localhost:5001/api/products/${productId}`, config);
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
        console.log("Token for SUBMIT:", token); // Log the token for debugging
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
        <div>
            <h1>Admin Product Management</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div className="ProductManagement">
                <form onSubmit={handleFormSubmit}>
                    <label>
                        Name:
                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Description:
                        <input
                            name="description"
                            type="text"
                            value={form.description}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Ratings:
                        <input
                            name="ratings"
                            type="number"
                            value={form.ratings}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Image URL:
                        <input
                            name="imageUrl"
                            type="text"
                            value={form.imageUrl}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>

                <h2>Product List</h2>
                <ul>
                    {products.map(product => (
                        <li key={product._id}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>{product.price}</p>
                            <p>{product.ratings}</p>
                            <button onClick={() => handleEditProduct(product)}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminProductManagement;
