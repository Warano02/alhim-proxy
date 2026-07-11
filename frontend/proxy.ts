import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login"];
const SESSION_COOKIE_NAME = "asg_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!isPublicRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && sessionToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

//   if (sessionToken) {
//     const isValid = await verifySession(sessionToken, request);
//     if (!isValid) {
//       const loginUrl = new URL("/admin", request.url);
//       loginUrl.searchParams.set("redirect", pathname);
//       loginUrl.searchParams.set("reason", "session_expired");
//       const response = NextResponse.redirect(loginUrl);
//     //   response.cookies.delete(SESSION_COOKIE_NAME);
//       return response;
//     }
//   }

  return NextResponse.next();
}

async function verifySession(
  token: string,
  request: NextRequest,
): Promise<boolean> {
  try {
    const response = await fetch(new URL("/api/auth/verify", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return response.ok;
  } catch (error) {
    console.error("Session verification failed:", error);
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
