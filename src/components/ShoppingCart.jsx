import { useState, useEffect } from "react";
import axios from "axios";

function ShoppingCart() {
    console.log('Cart component rendered');
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        console.log("useEffect hook executed");
        const fetchCart = async () => {
          console.log("Fetching cart...");
          setLoading(true); // Set loading to true at the start of the fetch
          try {
            const token = localStorage.getItem("token");
            if (!userId || !token) {
              console.error("User ID or token not found in local storage");
              return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            console.log(`http://localhost:5001/api/cart/${userId}`);
            const response = await axios.get(
              `http://localhost:5001/api/cart/${userId}`,
              config
            );
            if (response.data.items) {
              setCart(response.data.items);
            } else {
              setCart([]); // Set cart to an empty array if items is undefined
            }
            setError(""); // Clear any previous errors on successful fetch
          } catch (error) {
            console.error(error);
            setError("Error fetching cart");
          } finally {
            setLoading(false); // Ensure loading is set to false after fetch completes
          }
        };
        if (userId) {
          fetchCart();
        }
      }, [userId]);
    // Add item to cart
    const handleAddItem = async (productId, quantity = 1) => {
        setLoading(true); // Set loading to true during the add operation
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
          setError(""); // Clear any previous errors on successful operation
        } catch (error) {
          setError("Error adding item");
          console.error(error);
        } finally {
          setLoading(false); // Ensure loading is set to false after operation completes
        }
      };

      const handleRemoveItem = async (productId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Error: no token found");
                setLoading(false);
                return;
            }
            console.log(`Attempting to remove product with ID: ${productId}`); // Log the product ID
    
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(
                `http://localhost:5001/api/cart/remove/${productId}`,
                config
            );
    
            // Refresh cart after removing an item
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
        <div>
          <h1>Shopping Cart</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          <ul>
            {cart.map((item) => (
              <li key={item._id.toString()}>
                <h2>{item.productId.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => handleRemoveItem(item.productId._id)}>
                  Remove
                </button>
                <button onClick={() => handleAddItem(item.productId._id)}>
                  Add Item
                </button>
              </li>
            ))}
            
          </ul>
          
        </div>
        
      );
    }

export default ShoppingCart;
