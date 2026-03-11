import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer dans la DB
    await db.query(
      'INSERT INTO library_pi."Users" (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    // Récupérer l'utilisateur créé
    const result = await db.query(
      'SELECT * FROM library_pi."Users" WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET n'est pas défini dans .env");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", token },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);

    // Duplicate email (Postgres unique constraint)
    if (error.code === "23505") {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}