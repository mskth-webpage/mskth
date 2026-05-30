import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const intlResponse = handleI18nRouting(request);

  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(/^\/(en|sv)(\/.*)?$/);
  if (!localeMatch) return intlResponse;

  const locale = localeMatch[1];
  const afterLocale = pathname.slice(locale.length + 1);
  const isAdminRoute = afterLocale.startsWith("/admin");
  const isLoginRoute =
    afterLocale === "/admin/login" ||
    afterLocale.startsWith("/admin/login/");
  const isProtectedAdmin = isAdminRoute && !isLoginRoute;

  if (!isProtectedAdmin && !isLoginRoute) return intlResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedAdmin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin/login`;
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin/dashboard`;
    return NextResponse.redirect(url);
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
};
