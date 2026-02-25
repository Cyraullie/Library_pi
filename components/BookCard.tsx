"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBanner from "@/components/NotificationBanner";

interface BookCardProps {
  id: number;
  title: string;
  serie?: string;
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
  serie,
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
  const router = useRouter();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
      
      setNotification({
        message: data.error || "Erreur lors de la mise à jour",
        type: "error",
      });
    }
  } catch (err) {
    console.error(err);
    setNotification({
      message: "Erreur serveur",
      type: "error",
    });
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
          {!flipEnabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/books/${id}`);
              }}
              className="absolute top-2 right-2 z-20 
                        bg-black/60 hover:bg-black/80 
                        text-white text-xs font-bold 
                        w-7 h-7 rounded-full 
                        flex items-center justify-center 
                        transition cursor-pointer"
            >
              ℹ
            </button>
          )}
          <img
            src={image? image: "https://laz-img-sg.alicdn.com/p/3fe9c8a1dbfb5b3910e306183ec5d669.jpg"}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Overlay hover + / ✓ */}
          {!flipEnabled && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white text-6xl font-bold transition-opacity duration-200
                ${hovered || isAdded ? "opacity-100" : "opacity-0"}
                 ${!isAdded ? "cursor-pointer" : "cursor-default"}`}
                

            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // empêche le click de remonter
                  if (!isAdded && onAdd) onAdd();
                  if (isAdded) deleteBook(id);
                }}
                className="w-full h-full flex items-center justify-center"
              >
                {isAdded ? "✓" : "+"}
              </button>
            </div>
          )}

           {flipEnabled && (
              <p
                className={`text-xs font-bold ${
                  newRead ? "text-green-400" : "text-yellow-400"
                }`}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 20,
                  fontSize: 25,
                  borderRadius: 50,
                  textAlign: "center",
                  height: 47,
                  width: 47,
                  padding: 5,
                  backgroundColor: newRead ? "lightgreen" : "yellow",
                }}
              >
                {newRead ? "✓" : "⏱️"}
              </p>
            )}
          <div className="absolute bottom-0 w-full bg-black/70 p-3">
            <h2 className="font-bold text-sm">{serie}{serie? <br/> : ""}{title}</h2>
            <p className="text-xs text-gray-300">{author}</p>
            {tome && <p className="text-xs">Tome {tome}</p>}

           

          </div>
        </div>

        {/* FACE ARRIÈRE (UNIQUEMENT BIBLIOTHÈQUE) */}
        {flipEnabled && (
          <div
            className="absolute w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-xl flex flex-col"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <h3 className="font-semibold text-lg mb-4 text-center">
              Modifier le livre
            </h3>

            {/* Statut */}
            <div
              className="mb-4 flex items-center justify-between bg-gray-700 px-4 py-3 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-sm font-medium">
                {newRead ? "Lu" : "À lire"}
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newRead === 1}
                  onChange={(e) => setNewRead(e.target.checked ? 1 : 0)}
                  className="sr-only peer"
                />

                {/* Track */}
                <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>

                {/* Circle */}
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>

            {/* Note en étoiles */}
            <div className="mb-3">
              <label className="text-xs text-gray-400">Note</label>
              <div
                className="flex gap-1 mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRate(star)}
                    className={`text-xl transition ${
                      star <= newRate ? "text-yellow-400" : "text-gray-500"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Commentaire */}
            <div className="mb-4 flex-1">
              <label className="text-xs text-gray-400">Commentaire</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full mt-1 bg-gray-700 text-white rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Ajouter un commentaire..."
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateBook();
                }}
                className="flex-1 bg-green-600 hover:bg-green-500 transition py-2 rounded-md text-sm font-medium"
              >
                Sauvegarder
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBook(id);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 transition py-2 rounded-md text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
