"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">LibPi</h1>

      <nav className="flex gap-6 items-center">
        <Link href="/">Accueil</Link>
        <Link href="/books">Catalogue</Link>
        <Link href="/me/books">Ma bibliothèque</Link>
        <Link href="/books/add">Ajouter</Link>

        {!isLogged ? (
          <Link href="/login">Login</Link>
        ) : (
          <>
            <Link href="/profile">profil</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
