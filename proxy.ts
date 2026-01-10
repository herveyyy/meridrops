// proxy.ts
import { decode } from "@auth/core/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAdminPage = pathname.startsWith("/admin");
    const cookieName = request.cookies.get("__Secure-authjs.session-token")
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";
    const rawToken = request.cookies.get(cookieName)?.value;

    if (isAdminPage) {
        if (!rawToken) {
            console.log("No token found. Redirecting to login.");
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const decoded = await decode({
                token: rawToken,
                secret: process.env.AUTH_SECRET!,
                salt: cookieName,
            });

            const now = Math.floor(Date.now() / 1000);
            if (!decoded || (decoded.exp && (decoded.exp as number) < now)) {
                console.log("Token invalid or expired.");
                return NextResponse.redirect(
                    new URL("/login?reason=expired", request.url)
                );
            }

            console.log("Authorized access to admin:", decoded.email);
            return NextResponse.next();
        } catch (error) {
            console.error("Security Bypass Attempt or Decoding Error:", error);
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
