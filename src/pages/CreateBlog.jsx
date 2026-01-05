import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    // 🚫 Block guests
    if (!user) {
      alert("Please login to create a blog");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      if (!title.trim() || !content.trim()) {
  alert("Title and content cannot be empty");
  return;
}

      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        content: content.trim(),
        authorId: user.uid,
        authorEmail: user.email,

        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });

      alert("Blog Saved Successfully 🎉");
      setTitle("");
      setContent("");
      navigate("/blogs");

    } catch (error) {
      console.error("Error saving blog:", error);
      alert("❌ Error while saving blog");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Blog ✍️</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your content here..."
          className="w-full border p-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Blog"}
        </button>
      </form>
    </div>
  );
}
