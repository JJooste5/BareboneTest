import { authMiddleware, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};