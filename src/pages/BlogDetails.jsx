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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      const snap = await getDoc(doc(db, "blogs", id));
      if (!snap.exists()) return navigate("/blogs");

      setBlog({ id: snap.id, ...snap.data() });
      setTitle(snap.data().title);
      setContent(snap.data().content);
      setLoading(false);
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) return <Loader text="Loading blog..." />;

  const isAuthor = user && blog.authorId === user.uid;

  const handleDelete = async () => {
    if (!isAuthor) return;
    await deleteDoc(doc(db, "blogs", id));
    navigate("/blogs");
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "blogs", id), {
      title,
      content,
      updatedAt: serverTimestamp(),
    });
    setBlog({ ...blog, title, content });
    setEditing(false);
  };

  const handleLike = async () => {
    await updateDoc(doc(db, "blogs", id), { likes: increment(1) });
    setBlog({ ...blog, likes: (blog.likes || 0) + 1 });
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    const newComment = {
      text: comment,
      user: user.email,
      createdAt: new Date().toLocaleString(),
    };

    await updateDoc(doc(db, "blogs", id), {
      comments: arrayUnion(newComment),
    });

    setBlog({ ...blog, comments: [...(blog.comments || []), newComment] });
    setComment("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 glass-card mt-10">
      {blog.image && (
        <img
          src={blog.image}
          className="w-full h-56 object-cover rounded-xl mb-5"
          alt={blog.title}
        />
      )}

      {editing ? (
        <>
          <input className="input mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="input h-40" value={content} onChange={(e) => setContent(e.target.value)} />

          <div className="flex gap-3 mt-3">
            <button onClick={handleUpdate} className="btn-primary">Save</button>
            <button onClick={() => setEditing(false)} className="btn-primary bg-gray-500">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
          <p className="whitespace-pre-line">{blog.content}</p>

          <div className="flex gap-4 mt-4">
            <button onClick={handleLike}>❤️ {blog.likes || 0}</button>

            {isAuthor && (
              <>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={handleDelete} className="text-red-400">Delete</button>
              </>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Comments</h3>

            {blog.comments?.map((c, i) => (
              <div key={i} className="mt-2 p-2 rounded bg-white/10">
                <p>{c.text}</p>
                <small>{c.user}</small>
              </div>
            ))}

            {user && (
              <>
                <textarea
                  className="input mt-3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add comment..."
                />
                <button onClick={addComment} className="btn-primary mt-2">Comment</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
