import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔑 Forgot password
  const handleReset = async () => {
    if (!email) return alert("Enter your email first");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent 📧");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Login 🔐
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded
                     bg-white dark:bg-gray-800
                     text-black dark:text-white
                     border-gray-300 dark:border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded
                     bg-white dark:bg-gray-800
                     text-black dark:text-white
                     border-gray-300 dark:border-gray-600"
        />

        <button className="bg-black dark:bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
      </form>

      {/* Forgot password */}
      <button
        onClick={handleReset}
        className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        Forgot password?
      </button>
    </div>
  );
}
