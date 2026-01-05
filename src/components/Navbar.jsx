import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">
      {/* LOGO */}
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        My Blog
      </h1>

      {/* LINKS */}
      <div className="flex items-center gap-5">
        <Link
          to="/"
          className="text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
        >
          Home
        </Link>
        <Link
          to="/blogs"
          className="text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
        >
          Blogs
        </Link>

        {user && (
          <Link
            to="/create"
            className="text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
          >
            Create
          </Link>
        )}

        {!user ? (
          <>
            <Link
              to="/login"
              className="text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        )}

        {/* 🌙 DARK MODE BUTTON */}
        <button
          onClick={toggleDarkMode}
          className="text-xl p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
