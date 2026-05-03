// Verve App mockup — chrome (theme, icons, window, sidebar, toolbar)
// Routes live in mockup-routes.jsx

const VERVE_THEME = {
  dark: {
    bg:        "#0E0D0B",
    windowBg:  "#1A1815",
    sidebarBg: "#1C1A16",
    titleBar:  "#1C1A16",
    cardBg:    "#22201C",
    cardBg2:   "#1E1C18",
    paper:     "#1F1D1A",
    border:    "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.16)",
    divider:   "rgba(255,255,255,0.07)",
    textPri:   "#F2EEE5",
    textSec:   "rgba(242,238,229,0.62)",
    textTer:   "rgba(242,238,229,0.40)",
    hoverBg:   "rgba(255,255,255,0.05)",
    sidebarSel:"rgba(255,255,255,0.08)",
  },
  light: {
    bg:        "#F4F1EA",
    windowBg:  "#FAF8F3",
    sidebarBg: "#EEE9E0",
    titleBar:  "#EEE9E0",
    cardBg:    "#FFFFFF",
    cardBg2:   "#F7F4ED",
    paper:     "#FBF8F1",
    border:    "rgba(0,0,0,0.08)",
    borderStrong: "rgba(0,0,0,0.14)",
    divider:   "rgba(0,0,0,0.06)",
    textPri:   "#1B1A17",
    textSec:   "rgba(27,26,23,0.62)",
    textTer:   "rgba(27,26,23,0.42)",
    hoverBg:   "rgba(0,0,0,0.04)",
    sidebarSel:"rgba(0,0,0,0.06)",
  }
};

const ACCENTS_REAL = {
  bordeaux: { hex: "#7A1F2B", name: "Bordeaux" },
  ink:      { hex: "#1E3A8A", name: "Tinte" },
  graphite: { hex: "#1F2937", name: "Graphit" },
  sage:     { hex: "#3F6B3A", name: "Salbei" },
  amber:    { hex: "#B8602B", name: "Bernstein" },
  blue:     { hex: "#0A84FF", name: "macOS Blau" },
};

// Pseudonym (no Janik Hartmann)
const VERVE_AUTHOR = "L. Mariner";
const VERVE_AUTHOR_INITIALS = "LM";

// ───────────── icons ─────────────
function VIcon({name, size = 14}) {
  const icons = {
    "books":      "M3 2h2v12H3V2zm3 0h2v12H6V2zm4 0l3 12 1.5-.4L11.5 1.6 10 2z",
    "star":       "M8 1.5l1.95 4.07 4.45.55-3.27 3.1.83 4.36L8 11.4l-3.96 2.18.83-4.37-3.27-3.1 4.45-.54L8 1.5z",
    "archivebox": "M2 4h12v3H2V4zm1 4h10v6H3V8zm3 2v1h4v-1H6z",
    "doc":        "M4 1h6l3 3v11H4V1z",
    "doc.text":   "M4 1h6l3 3v11H4V1zm2 5h6v1H6V6zm0 2h6v1H6V8zm0 2h4v1H6v-1z",
    "person.2":   "M5.5 7a2 2 0 100-4 2 2 0 000 4zm5 0a2 2 0 100-4 2 2 0 000 4zM2 13c0-2 1.5-3 3.5-3s3.5 1 3.5 3v1H2v-1zm6.5 0c0-1 .5-2 1.5-2.5C11 11 12.5 12 12.5 13v1H8.5v-1z",
    "tray":       "M2 9l1-6h10l1 6v4H2V9zm2-1h8l-.7-4H4.7L4 8z",
    "shield":     "M8 1l5 2v5c0 3-2 5-5 6-3-1-5-3-5-6V3l5-2zm-1.5 7L8 9.5 11.5 6",
    "shield.checkered":"M8 1l5 2v5c0 3-2 5-5 6-3-1-5-3-5-6V3l5-2z",
    "share":      "M8 1v9M5 4l3-3 3 3M3 8v6h10V8",
    "search":     "M7 1a6 6 0 014.6 9.85l3 3-1.4 1.4-3-3A6 6 0 117 1zm0 2a4 4 0 100 8 4 4 0 000-8z",
    "command":    "M5.5 1.5h.5a2 2 0 012 2v1H5.5a1.5 1.5 0 110-3zm5 0h.5a1.5 1.5 0 110 3H10v-1a2 2 0 01.5-2zM5.5 11.5h.5a2 2 0 002-2v-1H5.5a1.5 1.5 0 100 3zm5 0h.5a1.5 1.5 0 100-3H10v1a2 2 0 00.5 2zM5 4.5h6v3H5z",
    "sidebar":    "M2.5 3h11v10h-11V3zm4 0v10",
    "rectangle.right":"M2.5 3h11v10h-11V3zm7 0v10",
    "viewfinder": "M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3M5 8a3 3 0 116 0 3 3 0 01-6 0z",
    "gear":       "M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 1l1 2 2 .5 1.5 1.5L12 7l1 2-1 2-2 .5L9 14l-1-1-1 1-1.5-1.5L4 12l-2-1 1-2-1-2 2-1 .5-2L6 2l1 1 1-1z",
    "bubble":     "M3 3h10v7H8l-3 3v-3H3V3z",
    "plus":       "M8 3v10M3 8h10",
    "checkmark":  "M3 8l3 3 7-7",
    "xmark":      "M4 4l8 8M12 4l-8 8",
    "chevron.right":"M6 3.5l4 4.5-4 4.5",
    "chevron.down": "M3.5 6l4.5 4 4.5-4",
    "chevron.up":   "M3.5 10l4.5-4 4.5 4",
    "wand":       "M2 14l8-8 2 2-8 8-2-2zM11 1l.5 1.5L13 3l-1.5.5L11 5l-.5-1.5L9 3l1.5-.5L11 1z",
    "sparkle":    "M8 1.5l1.5 4.5L14 7l-4.5 1L8 12.5 6.5 8 2 7l4.5-1L8 1.5z",
    "lightbulb":  "M5 6a3 3 0 116 0c0 1.5-1 2-1 3v1H6v-1c0-1-1-1.5-1-3zM6 12h4v1H6v-1z",
    "globe":      "M8 1a7 7 0 100 14A7 7 0 008 1zM1 8h14M8 1c2 2 3 4 3 7s-1 5-3 7c-2-2-3-4-3-7s1-5 3-7z",
    "folder":     "M2 4h4l1 1h7v9H2V4z",
    "tag":        "M2 8V2h6l6 6-6 6-6-6zm3-3.5a1 1 0 100 2 1 1 0 000-2z",
    "tags":       "M2 6V2h4l8 8-4 4-8-8zm2-2.5a.5.5 0 100 1 .5.5 0 000-1z",
    "image":      "M2 3h12v10H2V3zm10 8L9 7l-3 3-2-2v3h8v-1z",
    "list":       "M3 4h10v1H3V4zm0 4h10v1H3V8zm0 4h10v1H3v-1z",
    "list.bullet":"M2 4h1v1H2V4zm3 0h9v1H5V4zM2 8h1v1H2V8zm3 0h9v1H5V8zm-3 4h1v1H2v-1zm3 0h9v1H5v-1z",
    "grid":       "M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z",
    "square.grid":"M2 2h4v4H2V2zm6 0h4v4H8V2zm-6 6h4v4H2V8zm6 0h4v4H8V8z",
    "dots":       "M3 8a1 1 0 102 0 1 1 0 00-2 0zm4 0a1 1 0 102 0 1 1 0 00-2 0zm4 0a1 1 0 102 0 1 1 0 00-2 0z",
    "send":       "M2 13l13-5L2 3l1 5 7 0-7 0z",
    "info":       "M8 1a7 7 0 100 14A7 7 0 008 1zm0 4v1m0 2v4",
    "warning":    "M8 1l7 13H1L8 1zm0 5v4m0 2v0",
    "history":    "M8 2a6 6 0 11-5.5 8.5M8 4v4l3 2M2 5V2M2 5h3",
    "trash":      "M3 4h10v1H3V4zm1 1h8v9H4V5zm2-3h4v2H6V2z",
    "save":       "M3 9v4h10V9M8 1v8M5 6l3 3 3-3",
    "rocket":     "M2 14l5-5M9 7l-5 5-2-2 5-5M9 7l4-4 1 1-4 4M9 7l2 2",
    "moon":       "M11 2a6 6 0 100 12 6 6 0 01-2-12c1 0 2 0 3 0z",
    "sun":        "M8 4a4 4 0 100 8 4 4 0 000-8zM8 1v1M8 14v1M1 8h1M14 8h1M3 3l.7.7M12.3 12.3l.7.7M3 13l.7-.7M12.3 3.7L13 3",
    "calendar":   "M2 4h12v10H2V4zm0 3h12M5 2v3M11 2v3",
    "clock":      "M8 1a7 7 0 100 14A7 7 0 008 1zM8 4v4l3 2",
    "pin":        "M8 1l-2 4H4l3 3-1 5 2-1 2 1-1-5 3-3h-2l-2-4z",
    "bookmark":   "M4 1h8v14l-4-3-4 3V1z",
    "exclamation":"M8 1a7 7 0 100 14A7 7 0 008 1zM8 5v4m0 2v1",
    "checkmark.circle":"M8 1a7 7 0 100 14A7 7 0 008 1zm-3 7l2 2 4-4",
    "grip":       "M2 5h12M2 8h12M2 11h12",
    "scribble":   "M2 12c2-2 3-2 4 0s2 2 4 0 3-2 4 0",
    "bold":       "M4 3h4a2 2 0 012 2 2 2 0 01-1 1.7A2.5 2.5 0 0110 9a2.5 2.5 0 01-2.5 2.5H4V3zm2 2v2h2a1 1 0 100-2H6zm0 4v2h2.5a1 1 0 100-2H6z",
    "italic":     "M6 3h6v1H9.5L7 12h2v1H3v-1h2.5L8 4H6V3z",
    "underline":  "M5 3v6a3 3 0 006 0V3M3 13h10",
    "code":       "M5 3L1 8l4 5M11 3l4 5-4 5",
    "quote":      "M3 4h4v4c0 2-1 3-3 3v-1c1 0 2-1 2-2H3V4zm6 0h4v4c0 2-1 3-3 3v-1c1 0 2-1 2-2H9V4z",
    "paperclip":  "M11 4l-7 7c-1 1-1 3 0 4s3 1 4 0l7-7c2-2 2-4 0-6s-4-2-6 0L3 8",
    "link":       "M6 8l-2 2c-1 1-1 3 0 4s3 1 4 0l2-2M10 8l2-2c1-1 1-3 0-4s-3-1-4 0L6 4M5 11l6-6",
    "wand.stars": "M2 14l8-8 2 2-8 8-2-2zM11 1l.5 1.5L13 3l-1.5.5L11 5l-.5-1.5L9 3l1.5-.5L11 1zM13 9l.4 1.2L14.5 10.6 13.4 11l-.4 1.1L12.6 11 11.5 10.6 12.6 10.2 13 9z",
    "books.vertical":"M2.5 1h2v14h-2V1zm3 0h2v14h-2V1zm3 0l3 14 1.5-.4L11 .6 8.5 1z",
    "ellipsis":   "M3 8a1 1 0 102 0 1 1 0 00-2 0zm4 0a1 1 0 102 0 1 1 0 00-2 0zm4 0a1 1 0 102 0 1 1 0 00-2 0z",
    "scroll":     "M3 2h9v10c0 1 1 2 2 2H4c-1 0-1-1-1-2V2zm9 0v10c0 1 1 2 2 2",
    "rectangle.text":"M2 4h12v8H2V4zm2 2h6v1H4V6zm0 2h8v1H4V8z",
  };
  const path = icons[name] || icons["info"];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

// ───────────── Window shell ─────────────
function VerveApp({ route = "editor", focusMode = false, dark = true, accent = "bordeaux", hideInspector = true, scale = 1 }) {
  const t = VERVE_THEME[dark ? "dark" : "light"];
  const accentColor = ACCENTS_REAL[accent].hex;
  const accentSoft = accentColor + "26";

  return (
    <div className="vapp" style={{
      "--t-bg": t.bg, "--t-window": t.windowBg, "--t-sidebar": t.sidebarBg,
      "--t-toolbar": t.titleBar, "--t-card": t.cardBg, "--t-card2": t.cardBg2,
      "--t-paper": t.paper, "--t-border": t.border, "--t-border-strong": t.borderStrong,
      "--t-divider": t.divider, "--t-pri": t.textPri, "--t-sec": t.textSec, "--t-ter": t.textTer,
      "--t-hover": t.hoverBg, "--t-sel": t.sidebarSel,
      "--t-accent": accentColor, "--t-accent-soft": accentSoft,
      transform: `scale(${scale})`, transformOrigin: "top left",
    }}>
      <div className="vapp-titlebar">
        <div className="vapp-traffic">
          <span className="tl tl-r"/><span className="tl tl-y"/><span className="tl tl-g"/>
        </div>
      </div>

      <div className="vapp-shell">
        {!focusMode && <VerveSidebar route={route} />}
        <div className="vapp-main">
          {!focusMode && <VerveToolbar route={route} hideInspector={hideInspector} />}
          <div className="vapp-content">
            <div className="vapp-canvas">
              <VerveRoute route={route} />
            </div>
            {!hideInspector && route === "editor" && !focusMode && <VerveInspector />}
          </div>
        </div>
      </div>

      <style>{`
        .vapp {
          position: relative;
          width: 1280px;
          height: 800px;
          background: var(--t-window);
          color: var(--t-pri);
          font-family: -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
          font-size: 13px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 0 0 0.5px rgba(255,255,255,0.08),
            0 1px 0 rgba(255,255,255,0.04) inset,
            0 60px 120px -30px rgba(0,0,0,0.7),
            0 30px 60px -20px rgba(0,0,0,0.4);
        }
        .vapp-titlebar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 28px;
          z-index: 10;
          display: flex; align-items: center;
          padding: 0 14px;
          pointer-events: none;
        }
        .vapp-traffic { display: flex; gap: 8px; }
        .tl { width: 12px; height: 12px; border-radius: 50%; box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.15); }
        .tl-r { background: #ff5f57; }
        .tl-y { background: #febc2e; }
        .tl-g { background: #28c840; }
        .vapp-shell { display: flex; height: 100%; }
        .vapp-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .vapp-content { flex: 1; display: flex; min-height: 0; }
        .vapp-canvas { flex: 1; min-width: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}

// ───────────── Sidebar ─────────────
function VerveSidebar({ route }) {
  const isWerk = ["editor","dashboard","book","characters","places","magic","concepts","factions","timeline","notes","inbox","consistency","chat","style","plot"].includes(route);
  return (
    <aside className="vsb">
      <div className="vsb-header">
        <div style={{width: 64}} />
        <div className="vsb-profile">
          <div className="vsb-avatar">{VERVE_AUTHOR_INITIALS}</div>
          <span>{VERVE_AUTHOR}</span>
        </div>
      </div>

      <div className="vsb-werkcard">
        <div className="vsb-spine">
          <span>ES</span>
        </div>
        <div className="vsb-werkmeta">
          <div className="vsb-werkname">Die Eiserne Stunde</div>
          <div className="vsb-werksub">Reihe · 3 Bücher</div>
        </div>
        <VIcon name="chevron.down" size={10} />
      </div>

      <div className="vsb-search">
        <VIcon name="search" size={12} />
        <span>Suchen…</span>
        <kbd>⌘K</kbd>
      </div>

      <div className="vsb-scroll">
        <SBGroup title="Bibliothek">
          <SBItem icon="books.vertical" label="Alle Werke" badge={5} active={route==="library"} />
          <SBItem icon="star" label="Favoriten" badge={2} />
          <SBItem icon="archivebox" label="Archiv" badge={1} />
        </SBGroup>

        <SBGroup title="Aktives Werk" collapsed={false}>
          <SBItem icon="rectangle.text" label="Übersicht" active={route==="dashboard"} />
          <SBItem icon="chevron.down" label="Zyklus 1: Eisernes Land" badge={2} />
          <SBItem icon="doc" label="Buch I — Aschemund" indent={1} active={route==="book"} />
          <SBItem icon="doc.text" label="Buch II — Salzwacht" indent={1} active={route==="editor"} />
          <SBItem icon="chevron.right" label="Zyklus 2: Vogelschneise" badge={1} />
          <SBItem icon="bookmark" label="Lesezeichen" badge={4} />
        </SBGroup>

        <SBGroup title="Werk-Wissen">
          <SBItem icon="person.2" label="Figuren" badge={17} active={route==="characters"} />
          <SBItem icon="globe" label="Orte" badge={12} active={route==="places"} />
          <SBItem icon="wand.stars" label="Magie & Systeme" badge={4} active={route==="magic"} />
          <SBItem icon="tags" label="Konzepte" badge={9} active={route==="concepts"} />
          <SBItem icon="folder" label="Fraktionen" badge={4} active={route==="factions"} />
          <SBItem icon="calendar" label="Zeitlinie" badge={28} active={route==="timeline"} />
          <SBItem icon="scroll" label="Notizen & Recherche" badge={23} active={route==="notes"} />
        </SBGroup>

        <SBGroup title="Werkzeuge">
          <SBItem icon="tray" label="Inbox" badge={3} active={route==="inbox"} />
          <SBItem icon="shield" label="Konsistenz-Check" badge={2} active={route==="consistency"} />
          <SBItem icon="sparkle" label="Stil-Reviewer" active={route==="style"} />
          <SBItem icon="lightbulb" label="Plot-Helfer" active={route==="plot"} />
          <SBItem icon="bubble" label="Wissens-Chat" active={route==="chat"} />
          <SBItem icon="square.grid" label="Vorlagen" />
          <SBItem icon="share" label="Export" />
          <SBItem icon="history" label="Versionen" />
        </SBGroup>
      </div>

      <div className="vsb-footer">
        <span className="vsb-dot" />
        <span>Lokal · gespeichert</span>
        <button className="vsb-settings"><VIcon name="gear" size={12} /></button>
      </div>

      <style>{`
        .vsb {
          width: 240px;
          background: var(--t-sidebar);
          border-right: 0.5px solid var(--t-divider);
          display: flex; flex-direction: column;
          flex-shrink: 0;
          font-size: 12.5px;
        }
        .vsb-header {
          height: 44px;
          display: flex; align-items: center;
          padding: 0 10px;
          border-bottom: 0.5px solid var(--t-divider);
          gap: 8px;
        }
        .vsb-profile {
          margin-left: auto;
          display: flex; align-items: center; gap: 6px;
          color: var(--t-sec);
          font-size: 12px;
        }
        .vsb-avatar {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--t-accent);
          color: white;
          display: grid; place-items: center;
          font-size: 10.5px; font-weight: 600;
        }
        .vsb-werkcard {
          margin: 12px 10px 6px;
          padding: 8px 10px;
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-radius: 8px;
          display: flex; align-items: center; gap: 10px;
          color: var(--t-pri);
        }
        .vsb-spine {
          width: 28px; height: 36px;
          border-radius: 3px;
          background: linear-gradient(135deg, #5a1f29, #2d1318);
          color: rgba(255,255,255,0.92);
          display: grid; place-items: center;
          font-family: Georgia, serif; font-weight: 600; font-size: 11px;
          box-shadow: 1px 0 0 rgba(0,0,0,0.3), inset 0 0 0 0.5px rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .vsb-werkmeta { flex: 1; min-width: 0; }
        .vsb-werkname { font-size: 12px; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .vsb-werksub { font-size: 10.5px; color: var(--t-sec); margin-top: 2px; }
        .vsb-search {
          margin: 0 10px 8px;
          padding: 5px 10px;
          background: var(--t-hover);
          border-radius: 6px;
          display: flex; align-items: center; gap: 6px;
          color: var(--t-ter);
          font-size: 12px;
          cursor: text;
        }
        .vsb-search kbd {
          margin-left: auto;
          font-family: ui-monospace, monospace;
          font-size: 10.5px;
          color: var(--t-ter);
        }
        .vsb-scroll {
          flex: 1; overflow-y: auto;
          padding: 4px 6px;
        }
        .vsb-scroll::-webkit-scrollbar { width: 0; }
        .vsb-footer {
          height: 36px;
          padding: 0 14px;
          border-top: 0.5px solid var(--t-divider);
          display: flex; align-items: center; gap: 8px;
          color: var(--t-ter);
          font-size: 11px;
        }
        .vsb-dot { width: 6px; height: 6px; border-radius: 50%; background: #28c840; box-shadow: 0 0 8px rgba(40,200,64,0.5); }
        .vsb-settings { margin-left: auto; background: transparent; border: 0; color: var(--t-ter); cursor: pointer; padding: 4px; }
      `}</style>
    </aside>
  );
}

function SBGroup({ title, children }) {
  return (
    <div className="sbg">
      <div className="sbg-title">{title.toUpperCase()}</div>
      <div className="sbg-items">{children}</div>
      <style>{`
        .sbg { padding-bottom: 12px; }
        .sbg-title {
          font-size: 11px; font-weight: 600; letter-spacing: 0.6px;
          color: var(--t-ter);
          padding: 4px 12px;
        }
        .sbg-items { display: flex; flex-direction: column; gap: 1px; }
      `}</style>
    </div>
  );
}

function SBItem({ icon, label, badge, active, indent = 0 }) {
  return (
    <div className={`sbi ${active ? "sbi-active" : ""}`} style={{paddingLeft: 10 + indent * 14}}>
      <span className="sbi-icon"><VIcon name={icon} size={14} /></span>
      <span className="sbi-label">{label}</span>
      {badge != null && <span className="sbi-badge">{badge}</span>}
      <style>{`
        .sbi {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px 5px 10px;
          margin: 0 4px;
          border-radius: 6px;
          color: var(--t-sec);
          font-size: 12.5px;
          cursor: pointer;
        }
        .sbi:hover { background: var(--t-hover); }
        .sbi-active { background: var(--t-sel); color: var(--t-pri); font-weight: 500; }
        .sbi-active .sbi-icon { color: var(--t-accent); }
        .sbi-icon { display: inline-flex; width: 16px; color: var(--t-sec); flex-shrink: 0; }
        .sbi-label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sbi-badge {
          font-size: 11px;
          color: var(--t-ter);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}

// ───────────── Toolbar ─────────────
function VerveToolbar({ route, hideInspector }) {
  const labels = {
    dashboard: "Werk-Übersicht",
    editor: "Kapitel 7 — Der Brief am Bahnsteig",
    characters: "Figuren",
    places: "Orte",
    magic: "Magie & Systeme",
    concepts: "Konzepte",
    factions: "Fraktionen",
    timeline: "Zeitlinie",
    notes: "Notizen & Recherche",
    inbox: "Inbox",
    consistency: "Konsistenz-Check",
    chat: "Wissens-Chat",
    style: "Stil-Reviewer",
    plot: "Plot-Helfer",
    book: "Buch II — Salzwacht",
    library: "Alle Werke",
  };
  const showEditorTools = route === "editor";
  const showWerkSub = !["library"].includes(route);
  const showInspectorBtn = showEditorTools;
  return (
    <div className="vtb">
      <button className="vtb-btn"><VIcon name="sidebar" size={13} /></button>
      <div className="vtb-divider"/>
      <span className="vtb-title">{labels[route] || "Verve"}</span>
      {showWerkSub && <span className="vtb-sub">· Die Eiserne Stunde</span>}
      <div style={{flex: 1}}/>
      {showEditorTools && (
        <>
          <button className="vtb-btn"><VIcon name="viewfinder" size={13}/><span>Focus</span></button>
          <button className="vtb-btn vtb-btn-active"><VIcon name="doc.text" size={13}/><span>Einzelnes Kapitel</span></button>
          <div className="vtb-divider"/>
        </>
      )}
      <button className="vtb-btn"><VIcon name="bubble" size={13} /></button>
      <button className="vtb-btn"><VIcon name="shield.checkered" size={13} /></button>
      <button className="vtb-btn"><VIcon name="share" size={13} /></button>
      {showInspectorBtn && <button className={`vtb-btn ${!hideInspector ? "vtb-btn-active" : ""}`}><VIcon name="rectangle.right" size={13} /></button>}
      <button className="vtb-btn"><VIcon name="gear" size={13} /></button>

      <style>{`
        .vtb {
          height: 44px;
          background: var(--t-toolbar);
          border-bottom: 0.5px solid var(--t-divider);
          padding: 0 12px;
          display: flex; align-items: center; gap: 6px;
          flex-shrink: 0;
        }
        .vtb-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 8px;
          min-width: 26px; min-height: 26px;
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: var(--t-sec);
          font-size: 12.5px;
          cursor: pointer;
          font-family: inherit;
        }
        .vtb-btn:hover { background: var(--t-hover); color: var(--t-pri); }
        .vtb-btn-active { background: var(--t-sel); color: var(--t-pri); }
        .vtb-divider { width: 1px; height: 18px; background: var(--t-divider); margin: 0 4px; }
        .vtb-title { font-size: 12.5px; font-weight: 600; color: var(--t-pri); }
        .vtb-sub { font-size: 12px; color: var(--t-ter); }
      `}</style>
    </div>
  );
}

Object.assign(window, { VerveApp, VerveSidebar, VerveToolbar, VIcon, VERVE_THEME, ACCENTS_REAL, VERVE_AUTHOR, VERVE_AUTHOR_INITIALS });
