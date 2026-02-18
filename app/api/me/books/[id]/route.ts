// app/api/me/books/[id]/route.ts
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ⚠️ id = nom du dossier [id]
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id || decoded.userId;

    const { id } = await params; // ⚠️ unwrap
    const bookId = parseInt(id);
    if (isNaN(bookId)) return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });

    await db.query(
      "DELETE FROM Users_has_Books WHERE Users_id = ? AND Books_id = ?",
      [userId, bookId]
    );

    return NextResponse.json({ message: "Livre supprimé" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id || decoded.userId;

    const { id } = await params; // ⚠️ unwrap
    const bookId = parseInt(id);

    const { read, rate, comment } = await request.json();

    await db.query(
      `UPDATE Users_has_Books
       SET \`read\` = ?, rate = ?, \`comment\` = ?
       WHERE Users_id = ? AND Books_id = ?`,
      [read, rate, comment, userId, bookId]
    );

    return Response.json({ message: "Livre mis à jour" });
  } catch (err) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}