import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [blogs, setBlogs] = useState([]);

  // 🌙 DARK MODE STATE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addBlog = (blog) => {
    setBlogs([blog, ...blogs]);
  };

  return (
    <BrowserRouter>
      {/* ✅ NAVBAR WITH DARK MODE */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* 🌙 Dark mode wrapper */}
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pt-6 text-black dark:text-white transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
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
