import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">
        Bienvenue sur MyLibrary 📚
      </h1>

      <p className="text-gray-400 mb-8">
        Gère ta collection de livres et mangas facilement.
      </p>

      <div className="flex gap-4 mb-10">
        <Link href="/books" className="bg-blue-600 px-6 py-3 rounded">
          Voir le catalogue
        </Link>

        <Link href="/me/books" className="bg-green-600 px-6 py-3 rounded">
          Ma bibliothèque
        </Link>

      </div>
    </main>
  );
}
