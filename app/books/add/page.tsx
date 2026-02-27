"use client";

import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import NotificationBanner from "@/components/NotificationBanner";
import { useIsMobileDevice } from "@/components/useIsMobileDevice";

export default function AddBookPage() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileDevice();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();
  const [add, setAdd] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    isbn: "",
    title: "",
    serie: "", // ✅ ajouté ici
    author: "",
    image: "",
    publicationDate: today,
    editor: "",
    langage: "fr",
    tome: "1",
    BookType_id: "1",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔎 Recherche ISBN
  const lookupISBN = async () => {
    if (!form.isbn) return;

    setLoadingLookup(true);
    setError("");

    try {
      const res = await fetch(`/api/books/lookup/${form.isbn}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Livre non trouvé");
        setLoadingLookup(false);
        return;
      }
      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        author: data.author || prev.author,
        image: data.image || prev.image,
        publicationDate: data.publicationDate || prev.publicationDate,
        editor: data.editor || prev.editor,
        langage: data.language || prev.langage,
        serie: data.serie || prev.serie,
      }));
    } catch (err) {
      setError("Erreur lors de la recherche ISBN");
    }

    setLoadingLookup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
      
    e.preventDefault();
    if (!token) return setNotification({
      message: "Erreur lors de la modification",
      type: "error",
    });
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
          
        },
        body: JSON.stringify({
          ...form,
          tome: parseInt(form.tome),
          BookType_id: parseInt(form.BookType_id),
          Add: add,
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
        serie: "",
        author: "",
        image: "",
        publicationDate: "",
        editor: "",
        langage: "fr",
        tome: "1",
        BookType_id: "1",
      });
    } catch (err) {
      setError("Erreur réseau, réessayez.");
    }
  };

  const scan = () =>
  {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "scanner",
      {
        fps: 10,
        qrbox: 150
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("Code scanné :", decodedText);
        

        setForm((prev) => ({
        ...prev,
        isbn: decodedText,
        title: prev.title,
        author: prev.author,
        image: prev.image,
        publicationDate: prev.publicationDate,
        editor: prev.editor,
        langage: prev.langage,
        serie:  prev.serie,
      }));
        // On suppose que c’est un ISBN
        

        scanner.clear();
      },
      (error) => {
        // erreurs de scan ignorées
      }
    );
  }

  return (
    <main className="flex justify-center p-8">
      {notification && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-white p-8 rounded-xl w-full max-w-md flex flex-col gap-4 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center mb-2">
          Ajouter un livre
        </h1>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm text-center">{success}</p>
        )}

        {/* ISBN + Bouton recherche */}
        
      <div id="scanner" ref={scannerRef}
        className="w-full max-w-sm" />
      <button
      //TODO redisable button when finish
        //disabled={!isMobile}
        type="button"
        onClick={scan}
        className={`px-4 py-2 rounded ${
          isMobile
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Scanner un code-barres
      </button>
        <div className="flex gap-2">
          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            required
            className="p-2 rounded bg-gray-800 flex-1"
          />
          <button
            type="button"
            onClick={lookupISBN}
            className="bg-blue-600 px-3 rounded hover:bg-blue-700 transition"
          >
            {loadingLookup ? "..." : "🔎"}
          </button>
        </div>

        {/* Preview image */}
        {form.image && (
          <div className="flex justify-center">
            <img
              src={form.image}
              alt="Preview"
              className="w-32 h-44 object-cover rounded shadow-md border border-gray-700"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <input
          type="text"
          name="serie"
          placeholder="Serie (Ex: Harry Potter)"
          value={form.serie}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="title"
          placeholder="Titre (Ex: La coupe de feu)"
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

        <div
          className="mb-4 flex items-center justify-between bg-gray-700 px-4 py-3 rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-sm font-medium">
            Ajouter à ma bibliothèque
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setAdd(e.target.checked ? true : false)}
              className="sr-only peer"
            />

            {/* Track */}
            <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>

            {/* Circle */}
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
          </label>
        </div>
        <button
          type="submit"
          className="bg-green-600 p-2 rounded font-bold hover:bg-green-700 transition mt-2"
        >
          Ajouter le livre
        </button>
      </form>
    </main>
  );
}
