import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Loader from "../components/Loader";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      setBlogs(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          commentsCount: doc.data().comments?.length || 0,
        }))
      );

      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) return <Loader text="Loading blogs..." />;

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Latest Blogs ✨
      </h1>

      {/* Search */}
      <input
        className="w-full p-3 mb-8 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Blog Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map((blog) => (
          <Link
            to={`/blog/${blog.id}`}
            key={blog.id}
            className="group rounded-2xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* Blog Image */}
            {blog.imageUrl && (
              <div className="overflow-hidden">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition">
                {blog.title}
              </h2>

              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                {blog.content}
              </p>

              {/* Meta */}
              <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {blog.createdAt?.toDate().toLocaleDateString()}
                </span>

                <span className="flex gap-3">
                  ❤️ {blog.likes || 0}
                  💬 {blog.commentsCount}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No blogs found 😕
        </p>
      )}
    </div>
  );
}
