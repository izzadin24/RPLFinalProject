"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

const DUMMY_USERS = [
  { email: "guru@com", password: "123456", role: "guru_model", name: "Bu Sari" },
  { email: "observer@com", password: "123456", role: "observer", name: "Pak Budi" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    
    // Tarik data dari Supabase yang cocok dengan email dan password
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      alert("Email atau password salah!");
      return;
    }

    // Simpan data lengkap user ke localStorage
    localStorage.setItem("user", JSON.stringify(data));

    // Lempar ke halaman sesuai role
    if (data.role === "guru_model") {
      router.push("/dashboard");
    } else if (data.role === "observer") {
      router.push("/observer");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Edvisor</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Monitoring Lesson Study</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Daftar
          </a>
        </p>
      </div>
    </div>
  );
}