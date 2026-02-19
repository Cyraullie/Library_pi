import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return Response.json({ message: "Not authorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = decoded.id;

    const [rows]: any = await db.query(`
      SELECT 
        Books.id,
        Books.title,
        Books.author,
        Books.image,
        Books.tome,
        Users_has_Books.read,
        Users_has_Books.rate
      FROM Users_has_Books
      JOIN Books ON Users_has_Books.Books_id = Books.id
      WHERE Users_has_Books.Users_id = ?
    `, [userId]);

    return Response.json(rows);
  } catch (error) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }
}


export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return Response.json({ message: "Not authorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id; // ou decoded.userId selon ton token

    const { isbn, read = 0, rate = null, comment = null } = await req.json();

    if (!isbn) {
      return Response.json({ message: "ISBN manquant" }, { status: 400 });
    }

    // Récupère le livre par ISBN
    const [books]: any = await db.query("SELECT id FROM Books WHERE isbn = ?", [isbn]);

    if (books.length === 0) {
      return Response.json({ message: "Livre non trouvé" }, { status: 404 });
    }

    const bookId = books[0].id;

    // Vérifie si le livre existe déjà pour l'utilisateur
    const [existing]: any = await db.query(
      "SELECT * FROM Users_has_Books WHERE Users_id = ? AND Books_id = ?",
      [userId, bookId]
    );

    if (existing.length > 0) {
      return Response.json({ message: "Livre déjà dans votre bibliothèque" }, { status: 400 });
    }

    // Ajoute le livre
    await db.query(
      `INSERT INTO Users_has_Books (Users_id, Books_id, timestamp, \`read\`, rate, \`comment\`)
       VALUES (?, ?, NOW(), ?, ?, ?)`,
      [userId, bookId, read, rate, comment]
    );

    return Response.json({ message: "Livre ajouté à votre bibliothèque !" });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

