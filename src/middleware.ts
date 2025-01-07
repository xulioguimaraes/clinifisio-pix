import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (!token && pathname.startsWith("/painel")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/painel", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/painel",
    "/painel/schedules",
    "/painel/schedules",
    "/painel/services",
  ], // Rotas protegidas
};
