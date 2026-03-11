import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// -----------------------------------
// GET → liste tous les livres
// -----------------------------------
export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        "Books".id,
        "Books".isbn,
        "Books".title,
        "Books".serie,
        "Books".author,
        "Books".image,
        "Books".publicationDate,
        "Books".editor,
        "Books".langage,
        "Books".tome,
        "BookType".type as bookType
      FROM library_pi."Books"
      JOIN library_pi."BookType"
      ON "Books".BookType_id = "BookType".id
    `);
    return NextResponse.json(result.rows);
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
      BookType_id,
      Add
    } = await request.json();

    if (!isbn || !title || !author || !BookType_id) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    if (tome < 1) {
      return NextResponse.json({ error: "Champs tome doit être plus grand que 0" }, { status: 400 });
    }

    // Vérifier si le livre existe déjà
    const existing = await db.query(
      'SELECT id FROM library_pi."Books" WHERE isbn = $1',
      [isbn]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ message: "Livre déjà présent", id: existing.rows[0].id });
    }

    // Ajouter le livre et récupérer l'ID
    const result = await db.query(
      `INSERT INTO library_pi."Books" 
      (isbn, title, serie, author, image, publicationDate, editor, langage, tome, BookType_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id`,
      [
        isbn,
        title,
        serie || null,
        author,
        image || "",
        publicationDate || null,
        editor || null,
        langage || null,
        tome || 1,
        BookType_id
      ]
    );

    const bookId = result.rows[0].id;

    // Si on doit l'ajouter à l'utilisateur
    if (Add) {
      const auth = request.headers.get("authorization");
      if (!auth) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
      }

      const token = auth.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
      const userId = decoded.id;

      await db.query(
        `INSERT INTO library_pi."Users_has_Books"
        (Users_id, Books_id, timestamp, "read", rate, "comment")
        VALUES ($1, $2, NOW(), 0, 0, NULL)`,
        [userId, bookId]
      );
    }

    return NextResponse.json({ message: "Livre ajouté", id: bookId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}