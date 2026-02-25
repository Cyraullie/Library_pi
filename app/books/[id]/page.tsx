"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Comment {
  username: string;
  comment: string;
  rate: number;
}

export default function BookDetailPage() {
  const { id } = useParams(); // ⚠️ id = ISBN ici
  const [book, setBook] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [avgRate, setAvgRate] = useState<number>(0);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/books/details/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data.book);
        setEditForm(data.book); // important pour l’édition
        setComments(data.comments);
        setAvgRate(data.averageRating);
      });
  }, [id]);

  if (!book) return <div className="p-8">Chargement...</div>;

  const handleSave = async () => {
    const res = await fetch(`/api/books/${book.isbn}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      setBook(editForm);
      setEditMode(false);
    } else {
      alert("Erreur lors de la modification");
    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto text-white">
      <div className="flex gap-8">
        <img
          src={book.image ? book.image : "https://laz-img-sg.alicdn.com/p/3fe9c8a1dbfb5b3910e306183ec5d669.jpg"}
          alt={book.title}
          className="w-64 rounded-xl shadow-lg"
        />

        <div className="flex-1">
          {!editMode ? (
            <>
              <h1 className="text-3xl font-bold mb-2">
                {book.serie} {book.title}
              </h1>

              <p className="text-gray-400 mb-2">{book.author}</p>
              <p className="mb-2">Tome {book.tome}</p>
              <p className="mb-4">{book.editor}</p>

              <div className="text-yellow-400 text-xl mb-4">
                ⭐ {Number(avgRate || 0).toFixed(1)} / 5
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
              >
                Modifier le livre
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 bg-gray-800 p-6 rounded-lg">
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="p-2 bg-gray-700 rounded"
                placeholder="Titre"
              />

              <input
                value={editForm.serie || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, serie: e.target.value })
                }
                className="p-2 bg-gray-700 rounded"
                placeholder="Série"
              />

              <input
                value={editForm.author}
                onChange={(e) =>
                  setEditForm({ ...editForm, author: e.target.value })
                }
                className="p-2 bg-gray-700 rounded"
                placeholder="Auteur"
              />

              <input
                value={editForm.image}
                onChange={(e) =>
                  setEditForm({ ...editForm, image: e.target.value })
                }
                className="p-2 bg-gray-700 rounded"
                placeholder="Image URL"
              />

              <input
                value={editForm.editor}
                onChange={(e) =>
                  setEditForm({ ...editForm, editor: e.target.value })
                }
                className="p-2 bg-gray-700 rounded"
                placeholder="Éditeur"
              />

              <input
                type="number"
                value={editForm.tome}
                onChange={(e) =>
                  setEditForm({ ...editForm, tome: Number(e.target.value) })
                }
                className="p-2 bg-gray-700 rounded"
                placeholder="Tome"
              />

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 py-2 rounded hover:bg-green-500"
                >
                  Sauvegarder
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-red-600 py-2 rounded hover:bg-red-500"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Commentaires */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Commentaires ({comments.length})
        </h2>

        <div className="flex flex-col gap-4">
          {comments.map((c, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="font-semibold">{c.username}</span>
                <span className="text-yellow-400">
                  {"★".repeat(c.rate)}
                </span>
              </div>
              <p className="text-gray-300 mt-2">{c.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}