"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔴 Vérif 1 : mdp identiques
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // 🔴 Vérif 2 : longueur minimum
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Erreur lors de l'inscription");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/me/books");
  };

  return (
    <main className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 text-white p-8 rounded-xl w-80 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="p-2 rounded bg-gray-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Confirm password"
          className="p-2 rounded bg-gray-800"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button className="bg-green-600 p-2 rounded font-bold">
          Créer un compte
        </button>

        <p className="text-sm text-center mt-4">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-blue-400 underline">
            Se connecter
          </Link>
        </p>
      </form>
    </main>
  );
}
