"use client"
/* eslint-disable */
// Handles Supabase magic-link redirects that land on /callback?token_hash=...&type=...
// (and also the implicit #access_token form), verifies, stores the session, and
// forwards to /advocates. Keeps older email links working.

import { useEffect, useState } from "react"

const SB_URL = "https://bfispxhviyozcorimsdd.supabase.co"
const SB_KEY = "sb_publishable_6mBI0e5ji9KNOinypYRLFQ_ThfWDMe8"
const SESSION_KEY = "benefit_adv_session"

function decodeJwt(t: string): any {
  try {
    const p = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(decodeURIComponent(escape(atob(p))))
  } catch { return null }
}

export default function CallbackPage() {
  const [msg, setMsg] = useState("Signing you in…")
  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href)
        const hasHashTokens = url.hash && url.hash.includes("access_token")
        let sess: any = null
        if (hasHashTokens) {
          const h = new URLSearchParams(url.hash.slice(1))
          const at = h.get("access_token"); const rt = h.get("refresh_token"); const ei = parseInt(h.get("expires_in") || "3600", 10)
          const jwt = decodeJwt(at || "")
          sess = { access_token: at, refresh_token: rt, expires_at: Date.now() + ei * 1000, user: { id: jwt?.sub, email: jwt?.email } }
        } else {
          const token_hash = url.searchParams.get("token_hash")
          const type = url.searchParams.get("type") || "magiclink"
          if (!token_hash) { setMsg("This sign-in link is missing its token. Please request a new link from the directory."); return }
          const res = await fetch(`${SB_URL}/auth/v1/verify`, {
            method: "POST",
            headers: { apikey: SB_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ type, token_hash }),
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok || !data.access_token) {
            setMsg((data && (data.msg || data.error_description)) || "This sign-in link has expired or was already used. Please request a new one.")
            return
          }
          const jwt = decodeJwt(data.access_token)
          sess = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Date.now() + (data.expires_in || 3600) * 1000, user: { id: (data.user && data.user.id) || jwt?.sub, email: (data.user && data.user.email) || jwt?.email } }
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(sess))
        window.location.replace("/advocates")
      } catch (e) {
        setMsg("Something went wrong while signing you in. Please request a new link from the directory.")
      }
    })()
  }, [])
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", fontFamily: "system-ui, sans-serif", color: "#44403c" }}>
      <div>
        <p style={{ fontSize: "18px", marginBottom: "10px" }}>{msg}</p>
        <p style={{ fontSize: "14px" }}><a href="/advocates" style={{ color: "#047857" }}>Go to the Advocate Directory</a></p>
      </div>
    </div>
  )
}
