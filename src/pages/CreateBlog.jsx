import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please login to create a blog");
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty");
      return;
    }

    setLoading(true);

    try {
      let cloudinaryUrl = "";
      let cloudinaryPublicId = "";

      /* 🔹 UPLOAD IMAGE TO CLOUDINARY */
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "content"); // 🔥 your preset

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dwqx0t1yb/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!data.secure_url) {
          throw new Error("Image upload failed");
        }

        cloudinaryUrl = data.secure_url;
        cloudinaryPublicId = data.public_id;
      }

      /* 🔹 SAVE BLOG TO FIRESTORE */
      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        content: content.trim(),
        image: cloudinaryUrl,
        imagePublicId: cloudinaryPublicId,
        authorId: user.uid,
        authorEmail: user.email,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });

      navigate("/blogs");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 glass-card">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Blog ✍️
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your content..."
          className="input h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 🖼️ IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <div className="relative">
            <img
              src={preview}
              className="w-full h-48 object-cover rounded-xl"
              alt="Preview"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}
