"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch("/api/me/books", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((books) => {
        const total = books.length;
        const read = books.filter((b: any) => b.read === 1).length;
        const toRead = total - read;

        setStats({ total, read, toRead });
      });
  }, []);

  if (!user) return <p className="p-6">Chargement...</p>;

  return (
    <main className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <p className="text-xl font-bold">{user.username}</p>
        <p className="text-gray-400">{user.email}</p>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-gray-400">Livres</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-2xl font-bold">{stats.read}</p>
            <p className="text-gray-400">Lus</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-2xl font-bold">{stats.toRead}</p>
            <p className="text-gray-400">À lire</p>
          </div>
        </div>
      )}
    </main>
  );
}
