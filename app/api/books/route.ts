import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        Books.id,
        Books.isbn,
        Books.serie,
        Books.title,
        Books.author,
        Books.image,
        Books.publicationDate,
        Books.editor,
        Books.langage,
        Books.tome,
        BookType.type as bookType
      FROM Books
      JOIN BookType ON Books.BookType_id = BookType.id
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur récupération livres" },
      { status: 500 }
    );
  }
}
