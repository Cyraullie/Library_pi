import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// -----------------------------------
// GET → liste tous les livres
// -----------------------------------
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        Books.id,
        Books.isbn,
        Books.title,
        Books.serie,
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
    return NextResponse.json({ error: "Erreur récupération livres" }, { status: 500 });
  }
}

// -----------------------------------
// POST → ajouter un livre global
// -----------------------------------
export async function POST(request: Request) {
  try {
    const {
      isbn,
      title,
      serie,
      author,
      image,
      publicationDate,
      editor,
      langage,
      tome,
      BookType_id
    } = await request.json();

    if (!isbn || !title || !author || !BookType_id) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const [existing]: any = await db.query("SELECT id FROM Books WHERE isbn = ?", [isbn]);

    if (existing.length > 0) {
      return NextResponse.json({ message: "Livre déjà présent", id: existing[0].id });
    }

    const [result]: any = await db.query(
      `INSERT INTO Books 
      (isbn, title, serie, author, image, publicationDate, editor, langage, tome, BookType_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        isbn,
        title,
        serie,
        author,
        image || "",
        publicationDate || null,
        editor || null,
        langage || null,
        tome || 1,
        BookType_id
      ]
    );

    return NextResponse.json({ message: "Livre ajouté", id: result.insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
