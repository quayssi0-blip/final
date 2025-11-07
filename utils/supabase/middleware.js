/**
 * Helpers for extracting an access token from requests and creating a server
 * supabase client that can be used in API routes or server components.
 *
 * NOTE: This file intentionally keeps helpers small and framework-agnostic.
 * It will extract a bearer token from either the Authorization header or from
 * cookies (common cookie names used by Supabase) and return the token along with
 * the server Supabase client (created with the service role key).
 *
 * Usage example (API route):
 * const { supabase, token } = getSupabaseFromRequest(req)
 * // Optionally set the auth header for requests that should act as the user
 * if (token) await supabase.auth.setAuth?.(token)
 * // then use supabase for queries
 */

import supabaseServer from "./server";

function _getCookieHeader(req) {
  // Support both Fetch Request-like and Node IncomingMessage-like headers
  if (!req) return undefined;
  if (typeof req.get === "function") return req.get("cookie");
  if (req.headers) {
    if (typeof req.headers.get === "function") return req.headers.get("cookie");
    return req.headers.cookie || req.headers.Cookie;
  }
  return undefined;
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...v] = part.split("=");
    if (!k) continue;
    cookies[k.trim()] = decodeURIComponent((v || []).join("=").trim());
  }
  return cookies;
}

export function getTokenFromRequest(req) {
  // 1) Authorization: Bearer <token>
  try {
    const authHeader =
      req?.headers?.authorization ||
      (typeof req.get === "function" && req.get("authorization")) ||
      (req?.headers && req.headers.Authorization) ||
      undefined;
    if (authHeader && typeof authHeader === "string") {
      const m = authHeader.match(/^Bearer (.+)$/i);
      if (m) return m[1];
    }
  } catch (e) {
    // ignore and fall back to cookies
  }

  // 2) Cookies (try common Supabase cookie names)
  const cookieHeader = _getCookieHeader(req);
  const cookies = parseCookies(cookieHeader);
  // Common cookie names that may contain an access token depending on your setup
  return (
    cookies["sb-access-token"] ||
    cookies["supabase-auth-token"] ||
    cookies["access_token"] ||
    null
  );
}

export function getSupabaseFromRequest(req) {
  const token = getTokenFromRequest(req);
  // Return a copy of the server client and the token. Callers can set auth on
  // the returned client if they want to run requests on behalf of the user.
  return { supabase: supabaseServer, token };
}

export default getSupabaseFromRequest;
