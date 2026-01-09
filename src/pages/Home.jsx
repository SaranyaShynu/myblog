import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <div
      className="relative h-[80vh] flex items-center justify-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1499750310107-5fef28a66643)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Welcome to StackStories ✨
        </h1>

        <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
          Read, write, and share ideas with the world.
          Built with React, Tailwind & Firebase.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/blogs"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Explore Blogs
          </Link>

          {user ? (
            <Link
              to="/create"
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Write a Blog
            </Link>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Login to Write
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
