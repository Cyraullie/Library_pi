"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanPage() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "scanner",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("Code scanné :", decodedText);

        // On suppose que c’est un ISBN
        const res = await fetch(
          `https://openlibrary.org/isbn/${decodedText}.json`
        );

        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setBook(data);
        } else {
          console.log("Livre non trouvé");
        }

        scanner.clear();
      },
      (error) => {
        // erreurs de scan ignorées
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);
//TODO scan fonctionnel 
//TODO pouvoir entrer un isbn tout seul et s'il est pas trouvé entré les infos 
  return (
    <main style={{ padding: 20 }}>
      <h1>Scanner un livre</h1>
      {book}
      <input type="text"></input>
      <button>send</button>
      <div id="scanner" ref={scannerRef} />
      {book && (
        <div style={{ marginTop: 20 }}>
          <h2>{book.title}</h2>
          <p>Nombre de pages : {book.number_of_pages}</p>
          <p>Date de publication : {book.publish_date}</p>
        </div>
      )}
    </main>
  );
}
