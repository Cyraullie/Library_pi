"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Erreur de connexion");
      return;
    }

  

    // 🔁 Redirection
    login(data.token)
    router.push("/me/books");
  };

  return (
    <main className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 text-white p-8 rounded-xl w-80 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-blue-600 p-2 rounded font-bold">
          Se connecter
        </button>

		<p className="text-sm text-center mt-4">
			Pas encore de compte ?{" "}
			<Link href="/register" className="text-blue-400 underline">
				S'inscrire
			</Link>
		</p>
      </form>
    </main>
  );
}
