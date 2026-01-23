
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware';

const handleI18nRouting = createMiddleware({
    locales: ['en', 'pt'],
    defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
    // 1. Run Supabase auth middleware first to update session/cookies
    const response = await updateSession(request);

    // 2. Run i18n middleware
    const intlResponse = handleI18nRouting(request);

    // 3. Merge cookies from Supabase response into Intl response
    // This ensures that if Supabase refreshed the token, we pass that on.
    response.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return intlResponse;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
}
