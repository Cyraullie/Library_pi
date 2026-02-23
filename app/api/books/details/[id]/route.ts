import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const bookId = Number(id);

  if (isNaN(bookId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    // 📚 Infos livre
    const [books]: any = await db.query(
      "SELECT * FROM Books WHERE id = ?",
      [bookId]
    );

    if (!books.length) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = books[0];

    // ⭐ Moyenne des notes
    const [ratings]: any = await db.query(
      "SELECT AVG(rate) as average, COUNT(rate) as total FROM Users_has_Books WHERE Books_id = ? AND rate IS NOT NULL",
      [bookId]
    );

    // 💬 Commentaires
    const [comments]: any = await db.query(
      `SELECT u.username, uhb.comment, uhb.rate
       FROM Users_has_Books uhb
       JOIN Users u ON u.id = uhb.Users_id
       WHERE uhb.Books_id = ? AND uhb.read = 1 AND uhb.comment != ""`,
      [bookId]
    );

    return NextResponse.json({
      book,
      averageRating: ratings[0].average || 0,
      totalRatings: ratings[0].total || 0,
      comments,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}