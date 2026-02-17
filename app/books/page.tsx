"use client";

import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";

interface Book {
  id: number;
  isbn: string;
  title: string;
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

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Catalogue</h1>

	<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
		{books.map((book) => (
			<BookCard
			key={book.id}
			title={book.title}
			author={book.author}
			image={book.image}
			tome={book.tome}
			onClick={() => console.log("Click:", book.title)}
			/>
		))}
		</div>

    </main>
  );
}
