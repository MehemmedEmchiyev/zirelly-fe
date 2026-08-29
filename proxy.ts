import { NextResponse, type NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.zirelly.az/api";
const CACHE_TTL_MS = 60_000;

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
  const map = await loadRedirects();

  if (map.size === 0) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const normalized = pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  const rule = map.get(normalized);

  if (rule) {
    const destination = rule.to.startsWith("http")
      ? rule.to
      : new URL(rule.to, request.url);

    return NextResponse.redirect(destination, rule.code);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon|icon|robots|sitemap|.*\\..*).*)"],
};
