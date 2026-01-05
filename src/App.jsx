import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

function App() {
  const [blogs, setBlogs] = useState([]);

  const addBlog = (blog) => {
    setBlogs([blog, ...blogs]);
  };

  return (
    <BrowserRouter>
      <Navbar />

      {/* 🌙 Dark mode wrapper */}
      <div className="bg-gray-100 dark:bg-gray-800 min-h-screen pt-6 text-black dark:text-white transition-colors duration-500">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<BlogList blogs={blogs} />} />
          <Route path="/create" element={<CreateBlog addBlog={addBlog} />} />
          <Route path="/blog/:id" element={<BlogDetails blogs={blogs} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
