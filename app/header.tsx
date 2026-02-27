"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReportIssueButton from "@/components/ReportIssueButton";
import logo from "@/assets/logo.png"
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const { isLogged, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="flex justify-between items-center p-4 max-w-10xl">
        <Link href="/" style={{display: "flex" }}>
          <Image src={logo} alt="Logo" style={{ height: 21*1.5, width: 23.8*1.5, marginRight: 20 }}/>
          <h1 className="text-xl font-bold" style={{textAlign: "center"}}>LibPi</h1>
        </Link>

        {/* Burger button (mobile only) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 items-center">
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
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-4 pb-4 bg-gray-800 animate-fadeIn">
          <ReportIssueButton />
          <Link href="/" onClick={closeMenu}>Accueil</Link>
          <Link href="/books" onClick={closeMenu}>Catalogue</Link>
          <Link href="/me/books" onClick={closeMenu}>Ma bibliothèque</Link>
          <Link href="/books/add" onClick={closeMenu}>Ajouter</Link>

          {!isLogged ? (
            <Link href="/login" onClick={closeMenu}>Login</Link>
          ) : (
            <>
              <Link href="/profile" onClick={closeMenu}>Profil</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition text-left"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}