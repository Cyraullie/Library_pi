"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NotificationBanner from "@/components/NotificationBanner";

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

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
      setNotification({
        message: "Erreur lors de la modification",
        type: "error",
      });
    }
  };

  return (
  <main className="p-4 sm:p-8 max-w-5xl mx-auto text-white">
    {notification && (
      <NotificationBanner
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
      />
    )}

    {/* Section principale du livre */}
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Image du livre */}
      <div className="flex-shrink-0 w-full md:w-64 flex justify-center md:justify-start">
        <img
          src={
            book.image
              ? book.image
              : "https://laz-img-sg.alicdn.com/p/3fe9c8a1dbfb5b3910e306183ec5d669.jpg"
          }
          alt={book.title}
          className="w-48 md:w-64 h-auto rounded-xl shadow-lg object-cover"
        />
      </div>

      {/* Infos du livre */}
      <div className="flex-1 flex flex-col gap-3">
        {!editMode ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {book.serie} {book.title}
            </h1>
            <p className="text-gray-400 mb-1">{book.author}</p>
            <p className="mb-1">Tome {book.tome}</p>
            <p className="mb-2">{book.editor}</p>

            <div className="text-yellow-400 text-lg sm:text-xl mb-2">
              ⭐ {Number(avgRate || 0).toFixed(1)} / 5
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 w-full sm:w-auto"
            >
              Modifier le livre
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg">
            <input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="p-2 bg-gray-700 rounded w-full"
              placeholder="Titre"
            />
            <input
              value={editForm.serie || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, serie: e.target.value })
              }
              className="p-2 bg-gray-700 rounded w-full"
              placeholder="Série"
            />
            <input
              value={editForm.author}
              onChange={(e) =>
                setEditForm({ ...editForm, author: e.target.value })
              }
              className="p-2 bg-gray-700 rounded w-full"
              placeholder="Auteur"
            />
            <input
              value={editForm.image}
              onChange={(e) =>
                setEditForm({ ...editForm, image: e.target.value })
              }
              className="p-2 bg-gray-700 rounded w-full"
              placeholder="Image URL"
            />
            <input
              value={editForm.editor}
              onChange={(e) =>
                setEditForm({ ...editForm, editor: e.target.value })
              }
              className="p-2 bg-gray-700 rounded w-full"
              placeholder="Éditeur"
            />
            <input
              type="number"
              value={editForm.tome}
              onChange={(e) =>
                setEditForm({ ...editForm, tome: Number(e.target.value) })
              }
              className="p-2 bg-gray-700 rounded w-full"
              placeholder="Tome"
            />

            <div className="flex flex-col sm:flex-row gap-2 mt-2">
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
    <section className="mt-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-3">
        Commentaires ({comments.length})
      </h2>

      <div className="flex flex-col gap-3">
        {comments.map((c, index) => (
          <div key={index} className="bg-gray-800 p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{c.username}</span>
              <span className="text-yellow-400 text-sm sm:text-base">
                {"★".repeat(c.rate)}
              </span>
            </div>
            <p className="text-gray-300 mt-1 sm:mt-2">{c.comment}</p>
          </div>
        ))}
      </div>
    </section>
  </main>
  );
}