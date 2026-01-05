import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Loader from "../components/Loader";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading]=useState(true);

  const fetchBlogs = async () => {
    try {
       setLoading(true);
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const blogData = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          commentsCount: data.comments?.length || 0,
        };
      });

      setBlogs(blogData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
  return <Loader text="Loading blogs..." />;
  }

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Latest Blogs 📚</h1>

      <input
        type="text"
        placeholder="Search blogs..."
        className="w-full p-3 mb-6 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="space-y-6">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="border p-5 rounded shadow">
              <Link
                to={`/blog/${blog.id}`}
                className="text-2xl font-semibold text-blue-600 hover:underline"
              >
                {blog.title}
              </Link>

              <p className="mt-3 text-gray-700">
                {blog.content.slice(0, 150)}...
              </p>

              <div className="flex justify-between mt-4 text-sm text-gray-500">
                <span>
                  🕒 {blog.createdAt?.toDate().toLocaleDateString()}
                </span>

                <div className="flex gap-4">
                  <span>❤️ {blog.likes || 0}</span>
                  <span>💬 {blog.commentsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
