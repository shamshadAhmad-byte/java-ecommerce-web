import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Login from "./pages/Login";
import About from "./pages/About";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import SearchButton from "./components/SearchButton";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyProfile from "./pages/MyProfile";
import Verify from "./pages/Verify";
import ClotheWarping from "./pages/clothe-warping";

function App() {
  return (
    <div className="">
      <ToastContainer />
      <Navbar />
      <SearchButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/order-success" element={<Verify />} />
        <Route path="/order-cancel" element={<Cart />} />
        <Route path="/chat-with-ai" element={<ClotheWarping />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
