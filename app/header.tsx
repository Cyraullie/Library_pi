"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReportIssueButton from "@/components/ReportIssueButton";

export default function Header() {
  const router = useRouter();
  const { isLogged, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };
//TODO faire en responsive bitch
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">LibPi</h1>

      <nav className="flex gap-6 items-center">
        <ReportIssueButton />
        <Link href="/">Accueil</Link>
        <Link href="/books">Catalogue</Link>
        <Link href="/me/books">Ma bibliothèque</Link>
        <Link href="/books/add">Ajouter</Link>

        {!isLogged ? (
          <Link href="/login">Login</Link>
        ) : (
          <>
            <Link href="/profile">Profil</Link>
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
