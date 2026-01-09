import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../components/Loader";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  /* ---------- FETCH BLOG ---------- */
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, "blogs", id));

      if (!snap.exists()) {
        navigate("/blogs");
        return;
      }

      const data = snap.data();
      setBlog({ id: snap.id, ...data });
      setTitle(data.title);
      setContent(data.content);
      setLoading(false);
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) return <Loader text="Loading blog..." />;

  if (!blog) return null;

  const isAuthor = user && blog.authorId === user.uid;

  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    if (!isAuthor) return alert("Not allowed");

    // 🔥 Cloudinary image delete can be added here
    // await deleteCloudinaryImage(blog.imagePublicId)

    await deleteDoc(doc(db, "blogs", id));
    navigate("/blogs");
  };

  /* ---------- UPDATE ---------- */
  const handleUpdate = async () => {
    await updateDoc(doc(db, "blogs", id), {
      title,
      content,
      updatedAt: serverTimestamp(),
    });

    setBlog({ ...blog, title, content });
    setEditing(false);
  };

  /* ---------- LIKE ---------- */
  const handleLike = async () => {
    await updateDoc(doc(db, "blogs", id), {
      likes: increment(1),
    });

    setBlog({ ...blog, likes: (blog.likes || 0) + 1 });
  };

  /* ---------- COMMENT ---------- */
  const addComment = async () => {
    if (!comment.trim()) return;

    const newComment = {
      text: comment,
      user: user?.email || "Anonymous",
      createdAt: new Date().toLocaleString(),
    };

    await updateDoc(doc(db, "blogs", id), {
      comments: arrayUnion(newComment),
    });

    setBlog({
      ...blog,
      comments: [...(blog.comments || []), newComment],
    });

    setComment("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg shadow-xl">
      {/* IMAGE */}
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-xl mb-6 hover:scale-[1.02] transition-transform duration-300"
        />
      )}

      {editing ? (
        <>
          <input
            className="w-full p-3 mb-3 rounded bg-white/70 dark:bg-gray-700 border"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-3 rounded h-40 bg-white/70 dark:bg-gray-700 border"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex gap-3 mt-4">
            <button className="btn-primary" onClick={handleUpdate}>
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="btn-primary bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

          {/* CONTENT */}
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
            {blog.content}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleLike}
              className="px-3 py-1 rounded bg-pink-500 text-white hover:scale-105 transition"
            >
              ❤️ {blog.likes || 0}
            </button>

            {isAuthor && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* COMMENTS */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">
              Comments ({blog.comments?.length || 0})
            </h3>

            {blog.comments?.map((c, i) => (
              <div
                key={i}
                className="mb-3 p-3 rounded bg-white/50 dark:bg-gray-700/50"
              >
                <p>{c.text}</p>
                <small className="text-gray-500">{c.user}</small>
              </div>
            ))}

            {user ? (
              <>
                <textarea
                  className="w-full p-3 mt-3 rounded bg-white/70 dark:bg-gray-700 border"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  onClick={addComment}
                  className="btn-primary mt-2"
                >
                  Comment
                </button>
              </>
            ) : (
              <p className="text-gray-500 mt-3">
                Login to add a comment
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
