import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// -----------------------------------
// GET → récupère les livres d'un utilisateur
// -----------------------------------
export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET!
    ) as { id: number; email: string; username: string };

    const userId = decoded.id;

    const result = await db.query(`
      SELECT 
        "Books".id,
        "Books".title,
        "Books".serie,
        "Books".author,
        "Books".image,
        "Books".tome,
        "Users_has_Books"."read",
        "Users_has_Books".rate,
        "Users_has_Books".comment
      FROM library_pi."Users_has_Books"
      JOIN library_pi."Books" ON "Users_has_Books".Books_id = "Books".id
      WHERE "Users_has_Books".Users_id = $1
    `, [userId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

// -----------------------------------
// POST → ajoute un livre à la bibliothèque d'un utilisateur
// -----------------------------------
export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET!
    ) as { id: number; email: string; username: string };
    const userId = decoded.id;

    const { isbn, read = 0, rate = null, comment = null } = await req.json();

    if (!isbn) {
      return NextResponse.json({ message: "ISBN manquant" }, { status: 400 });
    }

    // Récupère le livre par ISBN
    const bookResult = await db.query(
      'SELECT id FROM library_pi."Books" WHERE isbn = $1',
      [isbn]
    );
    const books = bookResult.rows;

    if (books.length === 0) {
      return NextResponse.json({ message: "Livre non trouvé" }, { status: 404 });
    }

    const bookId = books[0].id;

    // Vérifie si le livre existe déjà pour l'utilisateur
    const existingResult = await db.query(
      'SELECT * FROM library_pi."Users_has_Books" WHERE Users_id = $1 AND Books_id = $2',
      [userId, bookId]
    );
    const existing = existingResult.rows;

    if (existing.length > 0) {
      return NextResponse.json({ message: "Livre déjà dans votre bibliothèque" }, { status: 400 });
    }

    // Ajoute le livre
    await db.query(
      `
      INSERT INTO library_pi."Users_has_Books" 
        (Users_id, Books_id, timestamp, "read", rate, comment)
      VALUES ($1, $2, NOW(), $3, $4, $5)
      `,
      [userId, bookId, read, rate, comment]
    );

    return NextResponse.json({ message: "Livre ajouté à votre bibliothèque !" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}