"use client"
/* eslint-disable */
// BENEFIT Advocate Directory — /advocates
// Self-contained client page wired to Supabase (REST + Auth + Storage) via fetch.
// No external dependencies. Not linked from the homepage.

import { useEffect, useState, useCallback } from "react"

const SB_URL = "https://bfispxhviyozcorimsdd.supabase.co"
const SB_KEY = "sb_publishable_6mBI0e5ji9KNOinypYRLFQ_ThfWDMe8"
const SESSION_KEY = "benefit_adv_session"

const CSV_COLUMNS = ["first_name","last_name","tagline","city","state","country","postal_code","email","phone","bio","linkedin_url","substack_url","x_url","website_url","photo_url"]

// ---------- helpers ----------
function decodeJwt(t: string): any {
  try {
    const p = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(decodeURIComponent(escape(atob(p))))
  } catch { return null }
}
function esc(s: any) { return s == null ? "" : String(s) }
function initials(a: any) { return ((a.first_name?.[0] || "") + (a.last_name?.[0] || "")).toUpperCase() }
function colorFor(s: string) {
  const colors = ["#0f766e","#7c3aed","#b45309","#be123c","#1d4ed8","#0369a1","#4d7c0f","#9d174d","#374151"]
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return colors[h % colors.length]
}
function fullName(a: any) { return `${esc(a.first_name)} ${esc(a.last_name)}`.trim() }
function locationOf(a: any) { return [a.city, a.state, a.country].filter(Boolean).join(", ") }

// Minimal RFC-4180-ish CSV parser (handles quotes, commas and newlines inside quotes)
function parseCSV(text: string): any[] {
  const rows: string[][] = []
  let cur: string[] = []; let field = ""; let i = 0; let inQ = false
  while (i < text.length) {
    const c = text[i]
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue } inQ = false; i++; continue }
      field += c; i++; continue
    }
    if (c === '"') { inQ = true; i++; continue }
    if (c === ",") { cur.push(field); field = ""; i++; continue }
    if (c === "\r") { i++; continue }
    if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; i++; continue }
    field += c; i++
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur) }
  if (!rows.length) return []
  const header = rows[0].map((h) => h.trim().toLowerCase())
  const out: any[] = []
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r]
    if (cells.every((x) => (x || "").trim() === "")) continue
    const obj: any = {}
    header.forEach((h, idx) => { obj[h] = (cells[idx] == null ? "" : cells[idx]).trim() })
    out.push(obj)
  }
  return out
}
function downloadTemplate() {
  const header = CSV_COLUMNS.join(",")
  const example = ["Jane","Doe","Ethics researcher","Boston","Massachusetts","United States","02108","jane@example.com","+1 555 0100","Short bio. Links like [my essay](https://example.com) work.","https://linkedin.com/in/jane","https://jane.substack.com","https://x.com/jane","https://jane.example.com","https://example.com/jane.jpg"]
    .map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")
  const csv = header + "\n" + example + "\n"
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a"); a.href = url; a.download = "advocate-import-template.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

// Turn [label](url) and bare URLs into links
function Bio({ text }: { text: string }) {
  if (!text) return null
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g
  const nodes: any[] = []; let last = 0; let m: any; let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const label = m[2] ? m[1] : m[3]; const url = m[2] ? m[2] : m[3]
    nodes.push(<a key={k++} href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline underline-offset-2 break-words">{label}</a>)
    last = re.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return <p className="whitespace-pre-wrap leading-relaxed">{nodes}</p>
}

const IC: any = {
  linkedin: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/></svg>,
  x: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h6.9l4.8 6.3zM17.7 20h1.9L7.4 4H5.4z"/></svg>,
  substack: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16v2.4H4zM4 8.1h16V22l-8-4.5L4 22z"/></svg>,
  website: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>,
}

function Avatar({ a, size = 56 }: { a: any; size?: number }) {
  const st: any = { width: size, height: size }
  if (a.photo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={a.photo_url} alt="" style={{ ...st, objectFit: "cover" }} className="rounded-full border border-black/10" />
  }
  return <div style={{ ...st, background: colorFor(fullName(a)) }} className="rounded-full flex items-center justify-center text-white font-serif" >{initials(a)}</div>
}

function Socials({ a }: { a: any }) {
  const items: any[] = []
  if (a.linkedin_url) items.push(["LinkedIn", a.linkedin_url, IC.linkedin])
  if (a.substack_url) items.push(["Substack", a.substack_url, IC.substack])
  if (a.x_url) items.push(["X", a.x_url, IC.x])
  if (a.website_url) items.push(["Website", a.website_url, IC.website])
  if (!items.length) return null
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {items.map((it, i) => (
        <a key={i} title={it[0]} href={it[1]} target="_blank" rel="noopener noreferrer"
           className="w-8 h-8 border border-stone-200 rounded-lg flex items-center justify-center text-stone-700 hover:text-emerald-700 hover:border-emerald-600">{it[2]}</a>
      ))}
    </div>
  )
}

// ---------- main ----------
export default function AdvocatesPage() {
  const [session, setSession] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [rows, setRows] = useState<any[]>([])         // display rows (public or directory)
  const [loggedInView, setLoggedInView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState("")
  const [filters, setFilters] = useState({ q: "", state: "", country: "" })
  const [modal, setModal] = useState<any>(null)       // {type:'login'|'view'|'edit'|'delete'|'import', data?}

  // CSV import state
  const [importRows, setImportRows] = useState<any[]>([])
  const [importErr, setImportErr] = useState("")
  const [importResult, setImportResult] = useState<any>(null)
  const [importing, setImporting] = useState(false)

  const token = useCallback(() => (session?.access_token || SB_KEY), [session])

  const saveSession = (s: any) => {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(SESSION_KEY)
    setSession(s)
  }

  const api = useCallback(async (path: string, opts: any = {}) => {
    const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...opts,
      headers: { apikey: SB_KEY, Authorization: `Bearer ${session?.access_token || SB_KEY}`, "Content-Type": "application/json", ...(opts.headers || {}) },
    })
    const txt = await res.text()
    let data: any = null; try { data = txt ? JSON.parse(txt) : null } catch { data = txt }
    if (!res.ok) throw new Error((data && data.message) || res.statusText)
    return data
  }, [session])

  const loadPublic = useCallback(async () => {
    const data = await api("rpc/advocate_public_list", { method: "POST", body: "{}" })
    setRows(data || []); setLoggedInView(false)
  }, [api])

  const loadForUser = useCallback(async (sess: any) => {
    // own row -> admin flag + phone
    let admin = false
    try {
      const own = await fetch(`${SB_URL}/rest/v1/advocates?user_id=eq.${sess.user.id}&select=is_admin`, {
        headers: { apikey: SB_KEY, Authorization: `Bearer ${sess.access_token}` },
      }).then(r => r.json())
      admin = Array.isArray(own) && own[0] && own[0].is_admin
    } catch {}
    setIsAdmin(!!admin)
    // directory with emails
    const dir = await fetch(`${SB_URL}/rest/v1/rpc/advocate_directory`, {
      method: "POST", headers: { apikey: SB_KEY, Authorization: `Bearer ${sess.access_token}`, "Content-Type": "application/json" }, body: "{}",
    }).then(r => r.json())
    setRows(Array.isArray(dir) ? dir : []); setLoggedInView(true)
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true); setErr("")
    try {
      if (session) await loadForUser(session)
      else await loadPublic()
    } catch (e: any) { setErr(e.message || "Failed to load directory") }
    setLoading(false)
  }, [session, loadForUser, loadPublic])

  // init: parse magic-link hash, restore session
  useEffect(() => {
    let sess: any = null
    if (typeof window !== "undefined") {
      const h = window.location.hash
      if (h && h.includes("access_token")) {
        const p = new URLSearchParams(h.slice(1))
        const at = p.get("access_token"); const rt = p.get("refresh_token"); const ei = parseInt(p.get("expires_in") || "3600", 10)
        if (at) {
          const jwt = decodeJwt(at)
          sess = { access_token: at, refresh_token: rt, expires_at: Date.now() + ei * 1000, user: { id: jwt?.sub, email: jwt?.email } }
          localStorage.setItem(SESSION_KEY, JSON.stringify(sess))
          history.replaceState(null, "", window.location.pathname)
        }
      }
      if (!sess) {
        try { const raw = localStorage.getItem(SESSION_KEY); if (raw) sess = JSON.parse(raw) } catch {}
        if (sess && sess.expires_at && sess.expires_at < Date.now()) sess = null // expired -> treat as logged out
      }
    }
    setSession(sess)
    // load after session is set
    ;(async () => {
      setLoading(true); setErr("")
      try {
        if (sess) await loadForUser(sess); else await loadPublic()
      } catch (e: any) { setErr(e.message || "Failed to load directory") }
      setLoading(false)
    })()
  }, []) // once

  // ---------- auth ----------
  const [loginEmail, setLoginEmail] = useState("")
  const [loginMsg, setLoginMsg] = useState("")
  const [sending, setSending] = useState(false)
  const sendMagicLink = async () => {
    setSending(true); setLoginMsg("")
    try {
      const redirect = `${window.location.origin}/advocates`
      const res = await fetch(`${SB_URL}/auth/v1/otp?redirect_to=${encodeURIComponent(redirect)}`, {
        method: "POST", headers: { apikey: SB_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), create_user: true }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.msg || d.error_description || "Could not send link") }
      setLoginMsg("Check your email for a secure sign-in link.")
    } catch (e: any) { setLoginMsg(e.message || "Something went wrong.") }
    setSending(false)
  }
  const signOut = () => { saveSession(null); setIsAdmin(false); setModal(null); (async () => { setLoading(true); try { await loadPublic() } catch {} ; setLoading(false) })() }

  // ---------- derived ----------
  const uid = session?.user?.id
  const canEdit = (a: any) => !!session && (isAdmin || a.user_id === uid)
  const filtered = () => {
    const q = filters.q.trim().toLowerCase()
    return rows.filter((a) => {
      if (q && !fullName(a).toLowerCase().includes(q)) return false
      if (filters.state && a.state !== filters.state) return false
      if (filters.country && a.country !== filters.country) return false
      return true
    }).sort((x, y) => (`${x.last_name} ${x.first_name}`).localeCompare(`${y.last_name} ${y.first_name}`, undefined, { sensitivity: "base" }))
  }
  const uniq = (key: string) => Array.from(new Set(rows.map((r) => r[key]).filter(Boolean))).sort()

  // group by last-name letter
  const grouped = () => {
    const g: any = {}; const order: string[] = []
    filtered().forEach((a) => { const L = (a.last_name?.[0] || "#").toUpperCase(); if (!g[L]) { g[L] = []; order.push(L) } g[L].push(a) })
    return order.map((L) => ({ L, items: g[L] }))
  }

  // ---------- edit ----------
  const openEdit = async (id: string) => {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/advocates?id=eq.${id}&select=*`, {
        headers: { apikey: SB_KEY, Authorization: `Bearer ${token()}` },
      }).then((x) => x.json())
      const row = Array.isArray(r) ? r[0] : null
      if (!row) throw new Error("Could not load profile")
      setModal({ type: "edit", data: { ...row, highlights: row.highlights || [] } })
    } catch (e: any) { alert(e.message) }
  }
  const setField = (k: string, v: any) => setModal((m: any) => ({ ...m, data: { ...m.data, [k]: v } }))
  const saveProfile = async () => {
    const d = modal.data
    if (!d.first_name || !d.last_name) { alert("First and last name are required."); return }
    const patch: any = {
      first_name: d.first_name, last_name: d.last_name, tagline: d.tagline, city: d.city, state: d.state,
      country: d.country, postal_code: d.postal_code, email: d.email, phone: d.phone, bio: d.bio,
      linkedin_url: d.linkedin_url, substack_url: d.substack_url, x_url: d.x_url, website_url: d.website_url,
      photo_url: d.photo_url, highlights: (d.highlights || []).filter((h: any) => h.title || h.url),
    }
    try {
      await api(`advocates?id=eq.${d.id}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(patch) })
      setModal(null); await refresh()
    } catch (e: any) { alert("Save failed: " + e.message) }
  }
  const uploadPhoto = async (file: File) => {
    if (!file || !uid) return
    const path = `${uid}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`
    const res = await fetch(`${SB_URL}/storage/v1/object/${path.startsWith("advocate-photos") ? path : "advocate-photos/" + path}`, {
      method: "POST", headers: { apikey: SB_KEY, Authorization: `Bearer ${token()}`, "x-upsert": "true", "Content-Type": file.type || "application/octet-stream" }, body: file,
    })
    if (!res.ok) { alert("Photo upload failed."); return }
    const publicUrl = `${SB_URL}/storage/v1/object/public/advocate-photos/${path}`
    setField("photo_url", publicUrl)
  }
  const doDelete = async (id: string) => {
    try { await api(`advocates?id=eq.${id}`, { method: "DELETE" }); setModal(null); await refresh() }
    catch (e: any) { alert("Delete failed: " + e.message) }
  }

  // ---------- CSV import ----------
  const openImport = () => { setImportRows([]); setImportErr(""); setImportResult(null); setModal({ type: "import" }) }
  const onCsvFile = (file: File) => {
    setImportErr(""); setImportResult(null); setImportRows([])
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = parseCSV(String(reader.result || ""))
        const cleaned = parsed.filter((r) => (r.first_name || "").trim() && (r.last_name || "").trim())
        setImportRows(cleaned)
        if (!cleaned.length) setImportErr("No valid rows found. Each row needs at least first_name and last_name.")
        else if (cleaned.length < parsed.length) setImportErr(`${parsed.length - cleaned.length} row(s) were ignored for missing first/last name.`)
      } catch (e: any) { setImportErr("Could not read that file. Make sure it is a .csv exported from the template.") }
    }
    reader.readAsText(file)
  }
  const runImport = async () => {
    setImporting(true); setImportErr(""); setImportResult(null)
    try {
      const res = await api("rpc/advocate_bulk_upsert", { method: "POST", body: JSON.stringify({ rows: importRows }) })
      setImportResult(res || {})
      await refresh()
    } catch (e: any) { setImportErr(e.message || "Import failed") }
    setImporting(false)
  }

  // ---------- UI ----------
  const btn = "rounded-lg px-3.5 py-2 text-sm font-medium border"
  const primary = `${btn} bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800`
  const ghost = `${btn} bg-white text-stone-800 border-stone-200 hover:border-stone-300`
  const danger = `${btn} bg-white text-red-700 border-red-200 hover:bg-red-50`

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-stone-800">
      <div className="bg-stone-800 text-stone-100 text-xs text-center py-1.5 px-3">Advocate Directory — preview. Not yet linked from the main site.</div>

      <header className="border-b border-stone-200 bg-gradient-to-b from-[#eef3ee] to-[#f7f5ef]">
        <div className="max-w-5xl mx-auto px-5 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><polygon points="12,7 14,12 12,17 10,12" fill="#047857" stroke="none"/></svg>
            <div>
              <div className="text-[11px] tracking-[0.14em] uppercase text-stone-500">The BENEFIT Compass</div>
              <h1 className="font-serif text-2xl leading-tight">Advocate Directory</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {session ? (
              <>
                <span className="text-sm text-stone-500">Signed in{session.user?.email ? <> as <b className="text-stone-800">{session.user.email}</b></> : null} {isAdmin ? <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Admin</span> : <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Advocate</span>}</span>
                {isAdmin ? <button className={ghost} onClick={openImport}>Bulk import (CSV)</button> : null}
                {uid && rows.some((r) => r.user_id === uid) ? (
                  <button className={ghost} onClick={() => { const me = rows.find((r) => r.user_id === uid); if (me) openEdit(me.id) }}>Edit my profile</button>
                ) : null}
                <button className={ghost} onClick={signOut}>Sign out</button>
              </>
            ) : (
              <button className={primary} onClick={() => { setLoginMsg(""); setModal({ type: "login" }) }}>Advocate sign in</button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm text-stone-500 mt-4 max-w-3xl">Advocates committed to the BENEFIT values — Benevolence, Empathy, Nonviolence, Equity, Flourishing, Integrity, and Transparency.</p>

        {/* toolbar */}
        <div className="sticky top-0 z-10 bg-[#f7f5ef] py-3 mt-3 border-b border-stone-200">
          <div className="flex gap-2.5 flex-wrap items-end">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide text-stone-500">Search by name</label>
              <input value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="Type a name…" className="min-w-[220px] border border-stone-200 rounded-lg px-3 py-2 bg-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide text-stone-500">State / Region</label>
              <select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })} className="border border-stone-200 rounded-lg px-3 py-2 bg-white">
                <option value="">All</option>{uniq("state").map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide text-stone-500">Country</label>
              <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} className="border border-stone-200 rounded-lg px-3 py-2 bg-white">
                <option value="">All</option>{uniq("country").map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button className={ghost} onClick={() => setFilters({ q: "", state: "", country: "" })}>Clear</button>
            <span className="ml-auto text-sm text-stone-500 self-center">{filtered().length} {filtered().length === 1 ? "advocate" : "advocates"}</span>
          </div>
          <p className="text-xs text-stone-500 mt-2.5 flex gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" className="mt-0.5 shrink-0"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            <span>{loggedInView ? "Signed in: email addresses are visible to advocates. Phone numbers stay private to each owner and admins." : "Public view: email and phone are hidden. Sign in as an advocate to see email addresses."}</span>
          </p>
        </div>

        {/* list */}
        <main className="py-4 pb-20">
          {loading ? <div className="text-center text-stone-500 py-16">Loading directory…</div> :
           err ? <div className="text-center text-red-700 py-16">{err}</div> :
           filtered().length === 0 ? <div className="text-center text-stone-500 py-16">No advocates match your search.</div> :
           grouped().map((grp) => (
            <div key={grp.L}>
              <div className="font-serif text-emerald-800 border-b border-stone-200 pt-4 pb-1.5 mt-3 mb-3 tracking-wider">{grp.L}</div>
              <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
                {grp.items.map((a: any) => (
                  <div key={a.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-3.5">
                    <div className="shrink-0"><Avatar a={a} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-lg leading-tight">{fullName(a)}</p>
                      {a.tagline ? <p className="text-stone-500 text-sm mt-0.5">{a.tagline}</p> : null}
                      {locationOf(a) ? <p className="text-sm mt-2"><span className="text-emerald-700">◆</span> {locationOf(a)}</p> : null}
                      {loggedInView && a.email ? <p className="text-sm mt-1.5">✉︎ <a className="text-emerald-700 underline underline-offset-2 break-all" href={`mailto:${a.email}`}>{a.email}</a></p> : null}
                      <Socials a={a} />
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <button className={`${ghost} !px-2.5 !py-1.5`} onClick={() => setModal({ type: "view", data: a })}>View profile</button>
                        {canEdit(a) ? <button className={`${primary} !px-2.5 !py-1.5`} onClick={() => openEdit(a.id)}>Edit</button> : null}
                        {isAdmin ? <button className={`${danger} !px-2.5 !py-1.5`} onClick={() => setModal({ type: "delete", data: a })}>Delete</button> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* ---------- modals ---------- */}
      {modal ? (
        <div className="fixed inset-0 bg-stone-800/50 flex items-start justify-center p-6 overflow-auto z-50" onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            {modal.type === "login" ? (
              <div>
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"><h2 className="font-serif text-xl">Advocate sign in</h2><button className="text-stone-400 text-2xl leading-none px-2" onClick={() => setModal(null)}>×</button></div>
                <div className="p-5">
                  <p className="text-sm text-stone-500 mb-3">Enter your email and we'll send you a secure sign-in link — no password needed.</p>
                  <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className="w-full border border-stone-200 rounded-lg px-3 py-2" />
                  {loginMsg ? <p className="text-sm mt-3 text-emerald-800">{loginMsg}</p> : null}
                </div>
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-stone-200">
                  <button className={ghost} onClick={() => setModal(null)}>Cancel</button>
                  <button className={primary} disabled={sending || !loginEmail.trim()} onClick={sendMagicLink}>{sending ? "Sending…" : "Send sign-in link"}</button>
                </div>
              </div>
            ) : null}

            {modal.type === "import" ? (
              <div>
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"><h2 className="font-serif text-xl">Bulk import advocates</h2><button className="text-stone-400 text-2xl leading-none px-2" onClick={() => setModal(null)}>×</button></div>
                <div className="p-5">
                  <p className="text-sm text-stone-500 mb-3">Upload a CSV to add or update advocate profiles. Matching is by <b>email</b>: an email that already exists is updated (blank cells are ignored, so they won't erase existing data), and new emails are added. Rows without an email are always added.</p>
                  <button className={ghost} onClick={downloadTemplate}>Download CSV template</button>
                  <div className="mt-4">
                    <label className="text-xs text-stone-500 block mb-1">Choose your filled-in CSV</label>
                    <input type="file" accept=".csv,text/csv" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) onCsvFile(f) }} />
                  </div>
                  {importErr ? <p className="text-sm text-red-700 mt-3">{importErr}</p> : null}
                  {importRows.length ? (
                    <div className="mt-3">
                      <p className="text-sm">Ready to import <b>{importRows.length}</b> row{importRows.length === 1 ? "" : "s"}.</p>
                      <div className="mt-2 max-h-44 overflow-auto text-xs border border-stone-200 rounded-lg divide-y divide-stone-100">
                        {importRows.slice(0, 50).map((r, i) => (
                          <div key={i} className="px-3 py-1.5 flex justify-between gap-3">
                            <span className="font-medium">{esc(r.first_name)} {esc(r.last_name)}</span>
                            <span className="text-stone-500 truncate">{[r.email, locationOf(r)].filter(Boolean).join(" · ")}</span>
                          </div>
                        ))}
                        {importRows.length > 50 ? <div className="px-3 py-1.5 text-stone-500">…and {importRows.length - 50} more</div> : null}
                      </div>
                    </div>
                  ) : null}
                  {importResult ? <p className="text-sm text-emerald-800 mt-3">Done — added {importResult.inserted || 0}, updated {importResult.updated || 0}, skipped {importResult.skipped || 0}.</p> : null}
                </div>
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-stone-200">
                  <button className={ghost} onClick={() => setModal(null)}>Close</button>
                  <button className={primary} disabled={!importRows.length || importing} onClick={runImport}>{importing ? "Importing…" : `Import ${importRows.length || ""}`.trim()}</button>
                </div>
              </div>
            ) : null}

            {modal.type === "view" ? (() => { const a = modal.data; return (
              <div>
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"><h2 className="font-serif text-xl">Advocate profile</h2><button className="text-stone-400 text-2xl leading-none px-2" onClick={() => setModal(null)}>×</button></div>
                <div className="p-5">
                  <div className="flex gap-4 items-center"><Avatar a={a} size={72} /><div><h3 className="font-serif text-xl">{fullName(a)}</h3>{a.tagline ? <div className="text-stone-500 text-sm">{a.tagline}</div> : null}{locationOf(a) ? <div className="text-stone-500 text-sm">◆ {locationOf(a)}</div> : null}</div></div>
                  {a.bio ? <div className="mt-5"><h4 className="text-xs uppercase tracking-wider text-stone-500 mb-2">About</h4><Bio text={a.bio} /></div> : null}
                  <div className="mt-5"><Socials a={a} /></div>
                  {a.highlights && a.highlights.length ? <div className="mt-5"><h4 className="text-xs uppercase tracking-wider text-stone-500 mb-2">Highlights &amp; links</h4>{a.highlights.map((h: any, i: number) => <div key={i} className="text-sm">→ <a className="text-emerald-700 underline underline-offset-2" href={h.url} target="_blank" rel="noopener noreferrer">{h.title || h.url}</a></div>)}</div> : null}
                  {loggedInView ? (
                    <div className="mt-5"><h4 className="text-xs uppercase tracking-wider text-stone-500 mb-2">Contact</h4>{a.email ? <div className="text-sm"><b>Email:</b> <a className="text-emerald-700 underline underline-offset-2" href={`mailto:${a.email}`}>{a.email}</a></div> : null}</div>
                  ) : <p className="text-xs text-stone-500 mt-5">Sign in as an advocate to view contact details.</p>}
                </div>
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-stone-200">
                  {canEdit(a) ? <button className={primary} onClick={() => openEdit(a.id)}>Edit</button> : null}
                  {isAdmin ? <button className={danger} onClick={() => setModal({ type: "delete", data: a })}>Delete</button> : null}
                  <button className={ghost} onClick={() => setModal(null)}>Close</button>
                </div>
              </div>
            ) })() : null}

            {modal.type === "edit" ? (() => { const d = modal.data; const F = (k: string) => (e: any) => setField(k, e.target.value); return (
              <div>
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"><h2 className="font-serif text-xl">Edit profile</h2><button className="text-stone-400 text-2xl leading-none px-2" onClick={() => setModal(null)}>×</button></div>
                <div className="p-5 grid grid-cols-2 gap-3.5">
                  <div><label className="text-xs text-stone-500">First name</label><input value={esc(d.first_name)} onChange={F("first_name")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">Last name</label><input value={esc(d.last_name)} onChange={F("last_name")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div className="col-span-2"><label className="text-xs text-stone-500">Tagline</label><input value={esc(d.tagline)} onChange={F("tagline")} placeholder="e.g. Ethics researcher" className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div className="col-span-2"><label className="text-xs text-stone-500">Photo</label><div className="flex gap-3 items-center"><Avatar a={d} size={64} /><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) uploadPhoto(f) }} />{d.photo_url ? <button className={`${ghost} !px-2.5 !py-1`} onClick={() => setField("photo_url", "")}>Remove</button> : null}</div></div>
                  <div><label className="text-xs text-stone-500">City</label><input value={esc(d.city)} onChange={F("city")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">State / Region</label><input value={esc(d.state)} onChange={F("state")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">Country</label><input value={esc(d.country)} onChange={F("country")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">Postal code</label><input value={esc(d.postal_code)} onChange={F("postal_code")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">Email (private)</label><input value={esc(d.email)} onChange={F("email")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">Phone (private — you/admin only)</label><input value={esc(d.phone)} onChange={F("phone")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div className="col-span-2"><label className="text-xs text-stone-500">Bio</label><textarea value={esc(d.bio)} onChange={F("bio")} placeholder="Share anything. Add links with [text](https://…) or paste a URL." className="w-full border border-stone-200 rounded-lg px-3 py-2 min-h-[96px]" /><div className="text-xs text-stone-400 mt-1">Links: write [my essay](https://…) or paste a full URL — both become clickable.</div></div>
                  <div><label className="text-xs text-stone-500">LinkedIn URL</label><input value={esc(d.linkedin_url)} onChange={F("linkedin_url")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">Substack URL</label><input value={esc(d.substack_url)} onChange={F("substack_url")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">X URL</label><input value={esc(d.x_url)} onChange={F("x_url")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div><label className="text-xs text-stone-500">Other / website URL</label><input value={esc(d.website_url)} onChange={F("website_url")} className="w-full border border-stone-200 rounded-lg px-3 py-2" /></div>
                  <div className="col-span-2">
                    <label className="text-xs text-stone-500">Highlights &amp; links (articles, threads, anything to share)</label>
                    {(d.highlights || []).map((h: any, i: number) => (
                      <div key={i} className="flex gap-2 mt-2">
                        <input value={esc(h.title)} placeholder="Title" onChange={(e) => { const hl = [...d.highlights]; hl[i] = { ...hl[i], title: e.target.value }; setField("highlights", hl) }} className="flex-1 border border-stone-200 rounded-lg px-3 py-2" />
                        <input value={esc(h.url)} placeholder="https://…" onChange={(e) => { const hl = [...d.highlights]; hl[i] = { ...hl[i], url: e.target.value }; setField("highlights", hl) }} className="flex-1 border border-stone-200 rounded-lg px-3 py-2" />
                        <button className={`${danger} !px-2.5 !py-1.5`} onClick={() => { const hl = d.highlights.filter((_: any, j: number) => j !== i); setField("highlights", hl) }}>Remove</button>
                      </div>
                    ))}
                    <button className={`${ghost} !px-2.5 !py-1.5 mt-2`} onClick={() => setField("highlights", [...(d.highlights || []), { title: "", url: "" }])}>+ Add a link</button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-stone-200"><button className={ghost} onClick={() => setModal(null)}>Cancel</button><button className={primary} onClick={saveProfile}>Save profile</button></div>
              </div>
            ) })() : null}

            {modal.type === "delete" ? (() => { const a = modal.data; return (
              <div>
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200"><h2 className="font-serif text-xl">Confirm deletion</h2><button className="text-stone-400 text-2xl leading-none px-2" onClick={() => setModal(null)}>×</button></div>
                <div className="p-5"><p>Delete the profile for <b>{fullName(a)}</b>? This cannot be undone.</p></div>
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-stone-200"><button className={ghost} onClick={() => setModal(null)}>Cancel</button><button className={danger} onClick={() => doDelete(a.id)}>Delete profile</button></div>
              </div>
            ) })() : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
