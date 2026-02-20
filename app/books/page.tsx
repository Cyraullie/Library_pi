"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";

interface Book {
  id: number;
  isbn: string;
  title: string;
  serie: string;
  author: string;
  image: string;
  publicationDate: string;
  editor: string;
  langage: string;
  tome: number;
  bookType: string;
}

export default function CataloguePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [addedBooks, setAddedBooks] = useState<number[]>([]);
  
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    const loadData = async () => {
      // 1️⃣ Catalogue
      const resBooks = await fetch("/api/books");
      const booksData = await resBooks.json();
      console.log(booksData)
      // 2️⃣ Bibliothèque utilisateur
      let myBooks: Book[] = [];
      if (token) {
        const resMyBooks = await fetch("/api/me/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resMyBooks.ok) {
          myBooks = await resMyBooks.json();
        }
      }

      setBooks(booksData);
      setAddedBooks(myBooks.map((b) => b.id)); // ⚠️ id du livre
      setLoading(false);
    };

    loadData();
  }, [token]);

  if (loading) return <p className="p-6">Chargement...</p>;

  // Filtrage
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || book.bookType === filterType;

    return matchesSearch && matchesType;
  });

  const addToLibrary = async (bookId: number, isbn: string) => {
      if (!token) return alert("Vous devez être connecté");

      const res = await fetch("/api/me/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isbn: isbn }),
      });

      const data = await res.json();
    setAddedBooks((prev) => [...prev, bookId]);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catalogue</h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded flex-1 bg-gray-800 text-white placeholder-gray-400"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="all">Tous les types</option>
          <option value="Roman">Roman</option>
          <option value="Manga">Manga</option>
          <option value="BD">BD</option>
        </select>
      </div>

      {/* Grille */}
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
            flipEnabled={false}
            isAdded={addedBooks.includes(book.id)}
            onAdd={() => addToLibrary(book.id, book.isbn)}
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
