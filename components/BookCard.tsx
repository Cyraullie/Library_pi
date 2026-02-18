"use client";

import { useState } from "react";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  image: string;
  tome?: number;
  read?: number;
  rate?: number;
  comment?: string;

  flipEnabled?: boolean;
  isAdded?: boolean;
  onAdd?: () => void;
}

export default function BookCard({
  id,
  title,
  author,
  image,
  tome,
  read = 0,
  rate = 0,
  comment = "",
  flipEnabled = false,
  isAdded = false,
  onAdd,
}: BookCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [newRead, setNewRead] = useState(read);
  const [newRate, setNewRate] = useState(rate);
  const [newComment, setNewComment] = useState(comment);
  const [hovered, setHovered] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const updateBook = async () => {
  try {
    const res = await fetch(`/api/me/books/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        read: newRead,
        rate: newRate,
        comment: newComment,
      }),
    });

    if (res.ok) {
      // ✅ Le patch a réussi, on met à jour l’état local
      setFlipped(false); // ferme le flip
      // read, rate et comment sont déjà dans l’état
      // tu peux éventuellement afficher un petit toast ici
    } else {
      const data = await res.json();
      alert(data.error || "Erreur lors de la mise à jour");
    }
  } catch (err) {
    console.error(err);
    alert("Erreur serveur");
  }
};


  const deleteBook = async (id: number) => {
    await fetch(`/api/me/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.location.reload();
  };

  return (
    <div
      className="w-[250px] h-[400px] perspective"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={flipEnabled ? () => setFlipped(!flipped) : undefined}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* BOUTON AJOUT (CATALOGUE UNIQUEMENT) */}
        

        {/* FACE AVANT */}
        <div
          className="absolute w-full h-full bg-gray-900 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Overlay hover + / ✓ */}
          {!flipEnabled && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white text-6xl font-bold transition-opacity duration-200
                ${hovered || isAdded ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // empêche le click de remonter
                  if (!isAdded && onAdd) onAdd();
                }}
                className="w-full h-full flex items-center justify-center"
              >
                {isAdded ? "✓" : "+"}
              </button>
            </div>
          )}

          <div className="absolute bottom-0 w-full bg-black/70 p-3">
            <h2 className="font-bold text-sm">{title}</h2>
            <p className="text-xs text-gray-300">{author}</p>
            {tome && <p className="text-xs">Tome {tome}</p>}

            {flipEnabled && (
              <p
                className={`text-xs font-bold ${
                  newRead ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {newRead ? "Lu" : "À lire"}
              </p>
            )}

          </div>
        </div>

        {/* FACE ARRIÈRE (UNIQUEMENT BIBLIOTHÈQUE) */}
        {flipEnabled && (
          <div
            className="absolute w-full h-full bg-gray-800 text-white p-4 rounded-xl"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <h3 className="font-bold mb-2">Modifier</h3>

            <label className="text-sm">Statut</label>
            <select
              value={newRead}
              onChange={(e) => setNewRead(Number(e.target.value))}
              className="w-full mb-2 text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <option value={0}>À lire</option>
              <option value={1}>Lu</option>
            </select>

            <label className="text-sm">Note</label>
            <input
              type="number"
              min="0"
              max="5"
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              className="w-full mb-2 text-black"
              onClick={(e) => e.stopPropagation()}
            />

            <label className="text-sm">Commentaire</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full mb-2 text-black"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                updateBook();
              }}
              className="w-full bg-green-600 py-1 rounded mb-2"
            >
              Sauvegarder
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteBook(id);
              }}
              className="w-full bg-red-600 py-1 rounded"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
