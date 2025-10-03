import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/studio")) {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Basic ")) {
      return new NextResponse("Auth required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Comite"' }});
    }
    const [, b64] = auth.split(" ");
    const [user, pass] = atob(b64).split(":");
    if (user !== "admin" || pass !== (process.env.COMITE_ADMIN_PASS || "")) {
      return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Comite"' }});
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/studio/:path*", "/admin/:path*"] };
