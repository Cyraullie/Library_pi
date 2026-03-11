// app/api/me/books/[id]/route.ts
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET!
    ) as { id: number; email: string; username: string };
    const userId = decoded.id;

    const { id } = await params;
    const bookId = parseInt(id);
    if (isNaN(bookId))
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });

    await db.query(
      'DELETE FROM library_pi."Users_has_Books" WHERE Users_id = $1 AND Books_id = $2',
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
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET!
    ) as { id: number; email: string; username: string };
    const userId = decoded.id;

    const { id } = await params;
    const bookId = parseInt(id);

    const { read, rate, comment } = await request.json();

    if (read < 0 || read > 1) {
      return NextResponse.json({ error: "Status inconnu" }, { status: 400 });
    }
    if (rate < 0 || rate > 5) {
      return NextResponse.json({ error: "Note indisponible" }, { status: 400 });
    }

    await db.query(
      `UPDATE library_pi."Users_has_Books"
       SET "read" = $1, rate = $2, "comment" = $3
       WHERE Users_id = $4 AND Books_id = $5`,
      [read, rate, comment, userId, bookId]
    );

    return NextResponse.json({ message: "Livre mis à jour" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}