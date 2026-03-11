import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ isbn: string }> }
) {
  try {
    const { isbn } = await params;

    if (!isbn) {
      return NextResponse.json({ error: "Invalid ISBN" }, { status: 400 });
    }

    const body = await req.json();

    // 🔎 récupérer le livre actuel
    const bookResult = await db.query(
      'SELECT * FROM library_pi."Books" WHERE isbn = $1',
      [isbn]
    );

    if (bookResult.rows.length === 0) {
      return NextResponse.json({ error: "Livre non trouvé" }, { status: 404 });
    }

    const current = bookResult.rows[0];

    // 🧠 utiliser les anciennes valeurs si non définies
    const title = body.title ?? current.title;
    const author = body.author ?? current.author;
    const image = body.image ?? current.image;
    const editor = body.editor ?? current.editor;
    const langage = body.langage ?? current.langage;
    const tome = body.tome ?? current.tome;
    const serie = body.serie ?? current.serie;

    if (tome < 1) {
      return NextResponse.json(
        { error: "Champs tome doit être plus grand que 0" },
        { status: 400 }
      );
    }

    // ✏️ update
    await db.query(
      `UPDATE library_pi."Books"
       SET 
        title = $1,
        author = $2,
        image = $3,
        editor = $4,
        langage = $5,
        tome = $6,
        serie = $7
       WHERE isbn = $8`,
      [
        title,
        author,
        image,
        editor,
        langage,
        tome,
        serie,
        isbn,
      ]
    );

    return NextResponse.json({ message: "Livre modifié" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}