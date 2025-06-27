import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


// এখানে আপনার রোল ও পাথ ম্যাপিং দিন
const roleBasedPaths: Record<string, string> = {
  "/student": "student",
  "/admin": "admin",
  "/teacher": "teacher",
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const cookieStore = await cookies();
  const userRole = cookieStore.get("role")?.value;

  

  const pathname = url.pathname;

  for (const path in roleBasedPaths) {
    if (pathname.startsWith(path)) {
      if (userRole !== roleBasedPaths[path]) {
        url.pathname = `/${userRole}`;
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/teacher/:path*"],
};

