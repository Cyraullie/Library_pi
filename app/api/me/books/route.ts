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
