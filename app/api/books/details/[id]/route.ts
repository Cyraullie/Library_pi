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

    if (bookResult.rows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = bookResult.rows[0];

    // ⭐ Moyenne des notes
    const ratingsResult = await db.query(
      `SELECT 
        AVG(rate) AS average,
        COUNT(rate) AS total
       FROM library_pi."Users_has_Books"
       WHERE "Books_id" = $1 AND rate IS NOT NULL`,
      [bookId]
    );

    const ratings = ratingsResult.rows[0];

    // 💬 Commentaires
    const commentsResult = await db.query(
      `SELECT 
        u.username,
        uhb.comment,
        uhb.rate
       FROM library_pi."Users_has_Books" uhb
       JOIN library_pi."Users" u ON u.id = uhb."users_id"
       WHERE uhb."books_id" = $1
       AND uhb."read" = 1
       AND uhb.comment IS NOT NULL
       AND uhb.comment != ''`,
      [bookId]
    );

    return NextResponse.json({
      book,
      averageRating: Number(ratings?.average) || 0,
      totalRatings: Number(ratings?.total) || 0,
      comments: commentsResult.rows,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}