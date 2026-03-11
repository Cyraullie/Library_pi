import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID utilisateur invalide" }, { status: 400 });
    }

    const result = await db.query(`
      SELECT 
        "Books".id,
        "Books".isbn,
        "Books".title,
        "Books".author,
        "Books".image,
        "Books".publicationDate,
        "Books".editor,
        "Books".langage,
        "Books".tome,
        "BookType".type AS bookType,
        "Users_has_Books".timestamp,
        "Users_has_Books".read,
        "Users_has_Books".rate,
        "Users_has_Books".comment
      FROM library_pi."Users_has_Books"
      JOIN "Books" ON "Users_has_Books".Books_id = "Books".id
      JOIN "BookType" ON "Books".BookType_id = "BookType".id
      WHERE "Users_has_Books".Users_id = $1
    `, [userId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ⚠️ unwrap
    const userId = parseInt(id);

    const { isbn, read = 0, rate = null, comment = null } = await request.json();

    if (!isbn) {
      return NextResponse.json({ error: "ISBN manquant" }, { status: 400 });
    }

    // Vérifier que le livre existe dans le catalogue global
    const booksResult = await db.query('SELECT id FROM library_pi."Books" WHERE isbn = $1', [isbn]);
    if (booksResult.rows.length === 0) {
      return NextResponse.json({ error: "Livre non trouvé dans le catalogue global" }, { status: 404 });
    }

    const bookId = booksResult.rows[0].id;

    // Vérifie si l'utilisateur a déjà ce livre
    const existingResult = await db.query(
      'SELECT * FROM library_pi."Users_has_Books" WHERE Users_id = $1 AND Books_id = $2',
      [userId, bookId]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json({ message: "Livre déjà ajouté à cet utilisateur" });
    }

    // Ajouter le livre à l'utilisateur
    await db.query(
      `INSERT INTO "Users_has_Books" (Users_id, Books_id, timestamp, read, rate, comment)
       VALUES ($1, $2, NOW(), $3, $4, $5)`,
      [userId, bookId, read, rate, comment]
    );

    return NextResponse.json({ message: "Livre ajouté à l'utilisateur", bookId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}