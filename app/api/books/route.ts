import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
      BookType_id,
      Add
    } = await request.json();

    if (!isbn || !title || !author || !BookType_id) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    if (tome < 1)
    {
      return NextResponse.json({ error: "Champs tome doit être plus grand que 0" }, { status: 400 });
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

    if (Add)
    {
      const auth = request.headers.get("authorization");
      
          if (!auth) {
            return Response.json({ message: "Not authorized" }, { status: 401 });
          }
      
          const token = auth.split(" ")[1];
          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; username: string };
          const userId = decoded.id; // ou decoded.userId selon ton token

          const [rows]: any = await db.query(`
            SELECT id
            FROM Books
            ORDER BY id DESC
            LIMIT 1;
          `);

          // Ajoute le livre
          await db.query(
            `INSERT INTO Users_has_Books (Users_id, Books_id, timestamp, \`read\`, rate, \`comment\`)
            VALUES (?, ?, NOW(), 0, 0, NULL)`,
            [userId, rows[0].id,]
          );
    }
    return NextResponse.json({ message: "Livre ajouté", id: result.insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
