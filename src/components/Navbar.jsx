import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* ---------- DARK MODE ---------- */
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  /* ---------- AUTH ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        My Blog
      </h2>

      <div className="flex gap-6 items-center">
        {/* ALWAYS */}
        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
          Home
        </Link>

        <Link to="/blogs" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">
          Blogs
        </Link>

        {/* ONLY WHEN LOGGED IN */}
        {user && (
          <Link
            to="/create"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Create
          </Link>
        )}

        {/* LOGIN / LOGOUT */}
        {!user ? (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}

        {/* DARK MODE */}
        <button
          onClick={toggleDarkMode}
          className="text-xl p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
