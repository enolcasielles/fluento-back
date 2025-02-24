import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SUPABASE_KEY;

interface TokenPayload {
  sub: string;
  exp: number;
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET_KEY) as TokenPayload;
}

export function decodeToken(token: string): TokenPayload {
  return jwt.decode(token) as TokenPayload;
}
