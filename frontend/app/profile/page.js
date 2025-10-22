"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../utils/api";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("bankUser");
    if (!user) router.push("/login");

    api.get(`/user/${user}`).then((res) => {
      setForm((f) => ({ ...f, ...res.data }));
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/update", form);
      if (res.data.success) {
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("❌ Failed to update profile.");
      }
    } catch (err) {
      setMessage("❌ Error updating profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">👤 Profile Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={form.email}
            readOnly
            className="w-full border px-4 py-2 rounded bg-gray-100"
          />
          <input
            name="password"
            onChange={handleChange}
            type="password"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="New Password (optional)"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Update Profile
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </div>
    </div>
  );
}
