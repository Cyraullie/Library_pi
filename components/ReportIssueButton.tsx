"use client";

import { useState } from "react";

export default function ReportIssueButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const submitIssue = async () => {
    setLoading(true);
    setSuccess("");

    const res = await fetch("/api/github/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body: message }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Issue créée !");
      setTitle("");
      setMessage("");
      setTimeout(() => setSuccess(""), 1500);
      setTimeout(() => setOpen(false), 1500);
      
    } else {
      alert(data.error || "Erreur");
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        🐛 Signaler un problème
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Nouvelle issue</h2>

            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-800"
            />

            <textarea
              placeholder="Décris le problème..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-800 h-32"
            />

            {success && (
              <p className="text-green-400 text-sm mb-2">{success}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-600 px-3 py-1 rounded"
              >
                Annuler
              </button>

              <button
                onClick={submitIssue}
                disabled={loading}
                className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
              >
                {loading ? "..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}