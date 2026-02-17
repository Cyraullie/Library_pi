"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookCard from "@/components/BookCard";

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
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


  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Ma bibliothèque</h1>

		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
		{books.map((book) => (
			<BookCard
			key={book.id}
			isbn={book.isbn}
			title={book.title}
			author={book.author}
			image={book.image}
			tome={book.tome}
			read={book.read === 1}
			rate={book.rate || undefined}
			//onClick={() => console.log("Click:", book.title)}
			/>
		))}
		</div>

    </main>
  );
}
