import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return Response.json({ error: "Token manquant" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return Response.json({ error: "Token invalide" }, { status: 401 });
    }

    // decode token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; username: string };

    const userId = decoded.id;

    const [rows]: any = await db.query(
      "SELECT id, username, email FROM Users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return Response.json({ error: "User introuvable" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: "Token invalide" }, { status: 401 });
  }
}
