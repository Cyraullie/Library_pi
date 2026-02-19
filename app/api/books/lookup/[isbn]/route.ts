import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ isbn: string }> }
) {
  const { isbn } = await params;

  if (!isbn) {
    return NextResponse.json({ error: "ISBN manquant" }, { status: 400 });
  }

  try {
    // Google Books API
    const googleRes = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    const googleData = await googleRes.json();

    if (googleData.totalItems > 0) {
      const book = googleData.items[0].volumeInfo;

      return NextResponse.json({
        title: book.title || "",
        author: book.authors?.join(", ") || "",
        image: book.imageLinks?.thumbnail || "",
        publicationDate: book.publishedDate || "",
        editor: book.publisher || "",
        language: book.language || "",
      });
    }

    // Si Google ne trouve rien → OpenLibrary
    const openRes = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );

    const openData = await openRes.json();
    const key = `ISBN:${isbn}`;

    if (openData[key]) {
      const book = openData[key];

      return NextResponse.json({
        title: book.title || "",
        author: book.authors?.map((a: any) => a.name).join(", ") || "",
        image: book.cover?.medium || "",
        publicationDate: book.publish_date || "",
        editor: book.publishers?.map((p: any) => p.name).join(", ") || "",
        language: "",
      });
    }

    return NextResponse.json({ error: "Livre non trouvé" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
