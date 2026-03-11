// app/api/books/[id]/route.ts
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
    const bookResult = await db.query(
      'SELECT * FROM library_pi."Books" WHERE id = $1',
      [bookId]
    );
    const books = bookResult.rows;

    if (!books.length) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = books[0];

    // ⭐ Moyenne des notes
    const ratingsResult = await db.query(
      'SELECT AVG(rate) as average, COUNT(rate) as total FROM library_pi."Users_has_Books" WHERE Books_id = $1 AND rate IS NOT NULL',
      [bookId]
    );
    const ratings = ratingsResult.rows[0];

    // 💬 Commentaires
    const commentsResult = await db.query(
      `SELECT u.username, uhb.comment, uhb.rate
       FROM library_pi."Users_has_Books" uhb
       JOIN library_pi."Users" u ON u.id = uhb.Users_id
       WHERE uhb.Books_id = $1 AND uhb.read = 1 AND uhb.comment != ''`,
      [bookId]
    );
    const comments = commentsResult.rows;

    return NextResponse.json({
      book,
      averageRating: ratings?.average || 0,
      totalRatings: ratings?.total || 0,
      comments,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}