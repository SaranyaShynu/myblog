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

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  /* ---------------- FETCH BLOG ---------------- */
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "blogs", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          navigate("/blogs");
          return;
        }

        const data = snap.data();
        setBlog({ id: snap.id, ...data });
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  /* ---------------- AUTHOR CHECK ---------------- */
  const isAuthor = user && blog?.authorId === user.uid;

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!isAuthor) return alert("Not allowed");

    await deleteDoc(doc(db, "blogs", id));
    alert("Blog deleted");
    navigate("/blogs");
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!isAuthor) return alert("Not allowed");

    await updateDoc(doc(db, "blogs", id), {
      title,
      content,
      updatedAt: serverTimestamp(),
    });

    setBlog({ ...blog, title, content });
    setEditing(false);
  };

  /* ---------------- LIKE ---------------- */
  const handleLike = async () => {
    await updateDoc(doc(db, "blogs", id), {
      likes: increment(1),
    });

    setBlog({ ...blog, likes: (blog.likes || 0) + 1 });
  };

  /* ---------------- COMMENT ---------------- */
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
      comments: [newComment, ...(blog.comments || [])],
    });

    setComment("");
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return <Loader text="Loading blog..." />;
  }

  if (!blog) {
    return <p className="text-center mt-10">Blog not found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {editing ? (
        <>
          {/* EDIT MODE */}
          <input
            className="w-full border p-2 mb-2 dark:bg-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2 h-40 dark:bg-gray-700"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* BLOG CONTENT */}
          <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {blog.content}
          </p>

          {/* ACTIONS */}
          <div className="mt-5 flex gap-4 items-center">
            <button
              onClick={handleLike}
              className="bg-pink-500 text-white px-3 py-1 rounded"
            >
              ❤️ {blog.likes || 0}
            </button>

            {isAuthor && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded"
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

            {blog.comments?.length === 0 && (
              <p className="text-gray-500">No comments yet</p>
            )}

            {blog.comments?.map((c, i) => (
              <div
                key={i}
                className="border p-3 rounded mb-2 dark:border-gray-700"
              >
                <p>{c.text}</p>
                <small className="text-gray-400">{c.user}</small>
              </div>
            ))}

            {user && (
              <>
                <textarea
                  className="w-full border p-2 mt-3 dark:bg-gray-700"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button
                  onClick={addComment}
                  className="bg-black text-white px-4 py-2 mt-2 rounded"
                >
                  Comment
                </button>
              </>
            )}

            {!user && (
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
