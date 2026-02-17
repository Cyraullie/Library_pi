"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    isbn: "",
    title: "",
    author: "",
    image: "",
    publicationDate: "",
    editor: "",
    langage: "fr",
    tome: "1",
    BookType_id: "1",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          tome: parseInt(form.tome),
          BookType_id: parseInt(form.BookType_id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'ajout du livre");
        return;
      }

      setSuccess("Livre ajouté avec succès !");
      setForm({
        isbn: "",
        title: "",
        author: "",
        image: "",
        publicationDate: "",
        editor: "",
        langage: "fr",
        tome: "1",
        BookType_id: "1",
      });

      // Optionnel : rediriger vers le catalogue
      // router.push("/books");
    } catch (err) {
      setError("Erreur réseau, réessayez.");
    }
  };

  return (
    <main className="flex justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-white p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Ajouter un livre</h1>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}

        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          required
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="text"
          name="author"
          placeholder="Auteur"
          value={form.author}
          onChange={handleChange}
          required
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="text"
          name="image"
          placeholder="URL de l'image"
          value={form.image}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="date"
          name="publicationDate"
          placeholder="Date de publication"
          value={form.publicationDate}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="text"
          name="editor"
          placeholder="Éditeur"
          value={form.editor}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="text"
          name="langage"
          placeholder="Langue"
          value={form.langage}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="number"
          name="tome"
          placeholder="Tome"
          value={form.tome}
          onChange={handleChange}
          min={1}
          className="p-2 rounded bg-gray-800"
        />
        <select
          name="BookType_id"
          value={form.BookType_id}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800"
        >
          <option value="1">Roman</option>
          <option value="2">Manga</option>
          <option value="3">BD</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 p-2 rounded font-bold hover:bg-green-700 transition"
        >
          Ajouter le livre
        </button>
      </form>
    </main>
  );
}
