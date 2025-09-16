import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export default clerkMiddleware((auth, req: NextRequest) => {
  // Debug logging for production
  console.log('🔍 Middleware Debug:', {
    url: req.url,
    pathname: req.nextUrl.pathname,
    method: req.method,
    userAgent: req.headers.get('user-agent')?.slice(0, 50) + '...',
    timestamp: new Date().toISOString()
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};