import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Signup from "./components/signup";
import Login from "./components/login";
import Navbar from "./components/navbar";
import PrivateRoute from "./components/privateRoute";
import Home from "./components/home";
import Logout from "./components/logout";
import UserProfile from "./components/userProfile";
import AdminProductManagement from "./components/adminProductManagement";
import './input.css';
import Cart from "./components/ShoppingCart";
import ProductAbout from "./components/productAbout";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Home />} />
          <Route path="/AdminProductManagement" element={<AdminProductManagement />} />
          <Route path="/cart" element={<Cart key="cart"/>}/>
          <Route path="/productAbout/:productId" element={<ProductAbout />} />
          

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/products" element={<ProductList />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;


