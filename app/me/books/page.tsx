"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import BookCard from "@/components/BookCard";

export default function MyBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minRate, setMinRate] = useState("all");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/me/books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.log("API error:", data);
          setBooks([]);
        }
      });
  }, []);

  // ✅ Filtrage optimisé
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        Number(book.read) === Number(statusFilter);

      const matchesRate =
        minRate === "all" ||
        (book.rate && Number(book.rate) >= Number(minRate));

      return matchesSearch && matchesStatus && matchesRate;
    });
  }, [books, search, statusFilter, minRate]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Ma bibliothèque</h1>

      {/* 🔎 Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="all">Tous</option>
          <option value="0">À lire</option>
          <option value="1">Lu</option>
        </select>

        <select
          value={minRate}
          onChange={(e) => setMinRate(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="all">Toutes notes</option>
          <option value="1">⭐ 1+</option>
          <option value="2">⭐ 2+</option>
          <option value="3">⭐ 3+</option>
          <option value="4">⭐ 4+</option>
        </select>
      </div>

      {/* 📚 Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            serie={book.serie}
            author={book.author}
            image={book.image}
            tome={book.tome}
            read={book.read}
            rate={book.rate || undefined}
            comment={book.comment}
            flipEnabled={true}
          />
        ))}

        {filteredBooks.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            Aucun livre trouvé
          </p>
        )}
      </div>
    </main>
  );
}
