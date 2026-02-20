import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ isbn: string }> }
) {
  try {
    const { isbn } = await params;

    if (!isbn) {
      return NextResponse.json({ error: "ISBN manquant" }, { status: 400 });
    }

    const [rows]: any = await db.query(`
      SELECT 
        Books.id,
        Books.isbn,
        Books.title,
        Books.author,
        Books.image,
        Books.publicationDate,
        Books.editor,
        Books.langage,
        Books.tome,
        BookType.type AS bookType
      FROM Books
      JOIN BookType ON Books.BookType_id = BookType.id
      WHERE Books.isbn = ?
    `, [isbn]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Livre non trouvé" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ isbn: string }> }
) {
  const { isbn } = await context.params;
  const bookId = Number(isbn);

  if (isNaN(bookId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const {
      title,
      author,
      image,
      publicationDate,
      editor,
      langage,
      tome,
      serie,
    } = body;

  const formattedDate = body.publicationDate
  ? new Date(body.publicationDate).toISOString().split("T")[0]
  : null;

    await db.query(
      `UPDATE Books 
       SET title = ?, author = ?, image = ?, publicationDate = ?, 
           editor = ?, langage = ?, tome = ?, serie = ?
       WHERE isbn = ?`,
      [
        title,
        author,
        image,
        formattedDate,
        editor,
        langage,
        tome,
        serie,
        bookId,
      ]
    );

    return NextResponse.json({ message: "Livre modifié" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}