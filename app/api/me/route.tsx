import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // decode token
    const decoded: any = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as { id: number; email: string; username: string };
    const userId = decoded.id;

    const result = await db.query(
      'SELECT id, username, email FROM library_pi."Users" WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User introuvable" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}