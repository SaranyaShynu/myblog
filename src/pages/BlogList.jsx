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
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Latest Blogs 📚</h1>

      <input
        className="w-full p-3 mb-6 rounded bg-white dark:bg-gray-800"
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="glass-card p-4">
            {blog.image && (
              <img
                src={blog.image}
                className="h-40 w-full object-cover rounded-xl mb-3"
                alt={blog.title}
              />
            )}

            <Link
              to={`/blog/${blog.id}`}
              className="text-2xl font-semibold text-blue-400 hover:underline"
            >
              {blog.title}
            </Link>

            <p className="mt-2 text-gray-200 line-clamp-3">
              {blog.content}
            </p>

            <div className="flex justify-between mt-4 text-sm text-gray-300">
              <span>
                {blog.createdAt?.toDate().toLocaleDateString()}
              </span>
              <span>❤️ {blog.likes || 0} 💬 {blog.commentsCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
