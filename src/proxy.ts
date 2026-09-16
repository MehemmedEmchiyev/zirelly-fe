import { NextResponse, type NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.zirelly.az/api";
const CACHE_TTL_MS = 5_000;

// URL prefiksi olan dillər. Defolt dil (az) prefikssiz göstərilir: /elaqe,
// digərləri prefikslə: /ru/elaqe, /en/elaqe
const LOCALES = ["az", "en", "ru"];
const DEFAULT_LOCALE = "az";
const LANG_COOKIE = "language";

interface RedirectRule {
  to: string;
  code: number;
}

let cache: { map: Map<string, RedirectRule>; at: number } | null = null;

async function loadRedirects(): Promise<Map<string, RedirectRule>> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.map;
  }

  try {
    const res = await fetch(`${API_URL}/redirects`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2000),
    });

    if (res.ok) {
      const json = await res.json();
      const map = new Map<string, RedirectRule>();

      for (const rule of json.data ?? []) {
        map.set(rule.from_path, { to: rule.to_path, code: rule.code === 302 ? 302 : 301 });
      }

      cache = { map, at: Date.now() };
    }
  } catch {
    // API əlçatan olmayanda köhnə keş (varsa) istifadə olunur
  }

  return cache?.map ?? new Map();
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Prefiksi ayır: /ru/elaqe → locale=ru, bare=/elaqe
  const segment = pathname.split("/")[1];
  const locale = LOCALES.includes(segment) ? segment : null;
  const bare = locale ? pathname.slice(segment.length + 1) || "/" : pathname;

  // /az/... — defolt dil prefikssizdir, kanonik ünvana yönləndir
  if (locale === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = bare;
    const redirectRes = NextResponse.redirect(url, 301);
    redirectRes.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
    redirectRes.headers.set("Pragma", "no-cache");
    redirectRes.headers.set("Expires", "0");
    return redirectRes;
  }

  // Admin paneldən idarə olunan yönləndirmə qaydaları (prefikssiz yola görə)
  const map = await loadRedirects();
  const normalized = bare !== "/" ? bare.replace(/\/+$/, "") : "/";
  const rule = map.get(normalized);

  if (rule) {
    const destination = rule.to.startsWith("http")
      ? rule.to
      : new URL(locale ? `/${locale}${rule.to === "/" ? "" : rule.to}` : rule.to, request.url);

    const redirectRes = NextResponse.redirect(destination, rule.code);
    redirectRes.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
    redirectRes.headers.set("Pragma", "no-cache");
    redirectRes.headers.set("Expires", "0");
    return redirectRes;
  }

  if (!locale) {
    // Prefikssiz URL: istifadəçi əvvəl başqa dil seçibsə, prefiksli ünvana apar
    const cookieLang = request.cookies.get(LANG_COOKIE)?.value;

    if (cookieLang && cookieLang !== DEFAULT_LOCALE && LOCALES.includes(cookieLang)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${cookieLang}${pathname === "/" ? "" : pathname}`;
      const redirectRes = NextResponse.redirect(url);
      redirectRes.headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
      redirectRes.headers.set("Pragma", "no-cache");
      return redirectRes;
    }

    const headers = new Headers(request.headers);
    headers.set("x-locale", DEFAULT_LOCALE);
    return NextResponse.next({ request: { headers } });
  }

  // /ru/... və /en/...: daxildə prefikssiz route-a rewrite olunur,
  // dil isə header + cookie ilə ötürülür
  const url = request.nextUrl.clone();
  url.pathname = bare;

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);

  const response = NextResponse.rewrite(url, { request: { headers } });
  response.cookies.set(LANG_COOKIE, locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon|icon|robots|sitemap|.*\\..*).*)"],
};
