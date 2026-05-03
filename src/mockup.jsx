// True-to-app Verve mockup — matches Theme.swift + VerveMainWindow.swift
// 240px sidebar, 44px toolbar, Bordeaux accent, Georgia serif, real route content.

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

// SF-Symbol-style stroke icons (matched to VIcon mapping)
function VIcon({name, size = 14}) {
  const icons = {
    "books":      "M2 3v10h2V3H2zm3 0v10h2V3H5zm4 0l3 10 1.5-.5L10.5 2.5 9 3z",
    "star":       "M8 1l2.06 4.18L14.7 5.86l-3.35 3.27.79 4.61L8 11.56l-4.14 2.18.79-4.61L1.3 5.86l4.64-.68L8 1z",
    "archive":    "M2 4h12v2H2V4zm1 3h10v7H3V7zm3 2v1h4V9H6z",
    "doc":        "M3 1h7l3 3v11H3V1z",
    "doc.text":   "M3 1h7l3 3v11H3V1zm2 5h6v1H5V6zm0 2h6v1H5V8zm0 2h4v1H5v-1z",
    "people":     "M5 7a2 2 0 100-4 2 2 0 000 4zm5 0a2 2 0 100-4 2 2 0 000 4zM2 13c0-2 1.5-3 3-3s3 1 3 3v1H2v-1zm6 0c0-1 .5-2 1.5-2.5C10 11 11.5 12 11.5 13v1H8v-1z",
    "tray":       "M2 9l1-6h10l1 6v4H2V9zm2-1h8l-.7-4H4.7L4 8z",
    "shield.check":"M8 1l5 2v5c0 3-2 5-5 6-3-1-5-3-5-6V3l5-2zm-2 7l1.5 1.5L11 6",
    "share":      "M8 1v9M5 4l3-3 3 3M3 8v6h10V8",
    "search":     "M7 1a6 6 0 014.6 9.85l3 3-1.4 1.4-3-3A6 6 0 117 1zm0 2a4 4 0 100 8 4 4 0 000-8z",
    "command":    "M5 1a2 2 0 012 2v2H5a2 2 0 110-4zm6 0a2 2 0 110 4H9V3a2 2 0 012-2zM5 9a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 012 2 2 2 0 11-2 2v-2H9V9h2zM5 5h6v6H5V5z",
    "sidebar":    "M2 2h12v12H2V2zm4 0v12",
    "inspector":  "M2 2h12v12H2V2zm8 0v12",
    "focus":      "M2 5V2h3M11 2h3v3M14 11v3h-3M5 14H2v-3M5 8a3 3 0 116 0 3 3 0 01-6 0z",
    "settings":   "M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 1l1 2 2 .5 1.5 1.5L12 7l1 2-1 2-2 .5L9 14l-1-1-1 1-1.5-1.5L4 12l-2-1 1-2-1-2 2-1 .5-2L6 2l1 1 1-1z",
    "bubble":     "M3 3h10v7H8l-3 3v-3H3V3z",
    "plus":       "M8 3v10M3 8h10",
    "checkmark":  "M3 8l3 3 7-7",
    "xmark":      "M4 4l8 8M12 4l-8 8",
    "chevron.right":"M6 3l5 5-5 5",
    "chevron.down": "M3 6l5 5 5-5",
    "chevron.up":   "M3 10l5-5 5 5",
    "wand":       "M2 14l8-8 2 2-8 8-2-2zM11 1l.5 1.5L13 3l-1.5.5L11 5l-.5-1.5L9 3l1.5-.5L11 1zM4 1l.4 1.2L5.5 2.6 4.4 3l-.4 1.1L3.6 3 2.5 2.6 3.6 2.2 4 1z",
    "sparkle":    "M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z",
    "lightbulb":  "M5 6a3 3 0 116 0c0 1.5-1 2-1 3v1H6v-1c0-1-1-1.5-1-3zM6 12h4v1H6v-1z",
    "globe":      "M8 1a7 7 0 100 14A7 7 0 008 1zM1 8h14M8 1c2 2 3 4 3 7s-1 5-3 7c-2-2-3-4-3-7s1-5 3-7z",
    "folder":     "M2 4h4l1 1h7v9H2V4z",
    "tag":        "M2 8V2h6l6 6-6 6-6-6zm3-3.5a1 1 0 100 2 1 1 0 000-2z",
    "image":      "M2 3h12v10H2V3zm10 8L9 7l-3 3-2-2v3h8v-1z",
    "list":       "M3 3h10v1H3V3zm0 4h10v1H3V7zm0 4h10v1H3v-1z",
    "grid":       "M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z",
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
    "exclamation":"M8 1a7 7 0 100 14A7 7 0 008 1zM8 5v4m0 2v1",
    "checkmark.circle":"M8 1a7 7 0 100 14A7 7 0 008 1zm-3 7l2 2 4-4",
    "grip":       "M2 5h12M2 8h12M2 11h12",
    "scribble":   "M2 12c2-2 3-2 4 0s2 2 4 0 3-2 4 0",
    "bold":       "M4 3h4a2 2 0 012 2 2 2 0 01-1 1.7A2.5 2.5 0 0110 9a2.5 2.5 0 01-2.5 2.5H4V3zm2 2v2h2a1 1 0 100-2H6zm0 4v2h2.5a1 1 0 100-2H6z",
    "italic":     "M6 3h6v1H9.5L7 12h2v1H3v-1h2.5L8 4H6V3z",
    "code":       "M5 3L1 8l4 5M11 3l4 5-4 5",
    "quote":      "M3 4h4v4c0 2-1 3-3 3v-1c1 0 2-1 2-2H3V4zm6 0h4v4c0 2-1 3-3 3v-1c1 0 2-1 2-2H9V4z",
    "paperclip":  "M11 4l-7 7c-1 1-1 3 0 4s3 1 4 0l7-7c2-2 2-4 0-6s-4-2-6 0L3 8",
    "link":       "M6 8l-2 2c-1 1-1 3 0 4s3 1 4 0l2-2M10 8l2-2c1-1 1-3 0-4s-3-1-4 0L6 4M5 11l6-6",
  };
  const path = icons[name] || icons["info"];
  const isStroke = ["books","doc","doc.text","people","tray","shield.check","share","search","command","sidebar","inspector","focus","settings","bubble","plus","checkmark","xmark","chevron.right","chevron.down","chevron.up","wand","sparkle","lightbulb","globe","folder","list","grid","send","info","warning","history","save","rocket","moon","sun","calendar","clock","pin","exclamation","grip","scribble","bold","italic","code","quote","paperclip","link","tag","star","archive","image","trash"].includes(name);
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={isStroke ? "none" : "currentColor"} stroke={isStroke ? "currentColor" : "none"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

// =====================================================================
// Realistic Verve App Window
// =====================================================================

function VerveApp({ route = "editor", focusMode = false, dark = true, accent = "bordeaux", showInspector = true, scale = 1 }) {
  const t = VERVE_THEME[dark ? "dark" : "light"];
  const accentColor = ACCENTS_REAL[accent].hex;
  const accentSoft = accentColor + "26"; // 0.15 alpha-ish

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
      {/* Window chrome / traffic lights */}
      <div className="vapp-titlebar">
        <div className="vapp-traffic">
          <span className="tl tl-r"/><span className="tl tl-y"/><span className="tl tl-g"/>
        </div>
      </div>

      <div className="vapp-shell">
        {/* Sidebar */}
        {!focusMode && <VerveSidebar route={route} />}

        {/* Main area */}
        <div className="vapp-main">
          {!focusMode && <VerveToolbar route={route} />}
          <div className="vapp-content">
            <div className="vapp-canvas">
              <VerveRoute route={route} />
            </div>
            {showInspector && route === "editor" && !focusMode && <VerveInspector />}
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

function VerveSidebar({ route }) {
  return (
    <aside className="vsb">
      {/* Header w/ traffic-lights reservation */}
      <div className="vsb-header">
        <div style={{width: 64}} />
        <div className="vsb-profile">
          <div className="vsb-avatar">JH</div>
          <span>J. Hartmann</span>
        </div>
      </div>

      {/* Active work card */}
      <div className="vsb-werkcard">
        <div className="vsb-spine">
          <span>ES</span>
        </div>
        <div className="vsb-werkmeta">
          <div className="vsb-werkname">Die Eiserne Stunde</div>
          <div className="vsb-werksub">3 Bücher</div>
        </div>
        <VIcon name="chevron.down" size={10} />
      </div>

      {/* Search */}
      <div className="vsb-search">
        <VIcon name="search" size={12} />
        <span>Suchen…</span>
        <kbd>⌘K</kbd>
      </div>

      {/* Groups */}
      <div className="vsb-scroll">
        <SBGroup title="Bibliothek">
          <SBItem icon="books" label="Alle Werke" badge={5} active={route==="library"} />
          <SBItem icon="star" label="Favoriten" badge={2} />
          <SBItem icon="archive" label="Archiv" badge={1} />
        </SBGroup>

        <SBGroup title="Die Eiserne Stunde">
          <SBItem icon="doc.text" label="Übersicht" active={route==="dashboard"} />
          <SBItem icon="chevron.down" label="Zyklus 1" badge={2} />
          <SBItem icon="doc" label="Buch I — Aschemund" indent={1} active={route==="book"} />
          <SBItem icon="doc" label="Buch II — Salzwacht" indent={1} active={route==="editor"} />
          <SBItem icon="chevron.right" label="Zyklus 2" badge={1} />
        </SBGroup>

        <SBGroup title="Werk-Wissen">
          <SBItem icon="people" label="Figuren" badge={17} active={route==="characters"} />
          <SBItem icon="globe" label="Orte" badge={12} />
          <SBItem icon="wand" label="Magie" badge={4} />
          <SBItem icon="tag" label="Konzepte" badge={9} />
          <SBItem icon="folder" label="Fraktionen" badge={4} active={route==="world"} />
        </SBGroup>

        <SBGroup title="Werkzeuge">
          <SBItem icon="tray" label="Inbox" badge={3} active={route==="inbox"} />
          <SBItem icon="shield.check" label="Konsistenz" badge={2} active={route==="consistency"} />
          <SBItem icon="bubble" label="Wissens-Chat" active={route==="chat"} />
          <SBItem icon="share" label="Export" />
          <SBItem icon="grid" label="Vorlagen" />
        </SBGroup>
      </div>

      {/* Footer status */}
      <div className="vsb-footer">
        <span className="vsb-dot" />
        <span>Lokal · gespeichert</span>
        <button className="vsb-settings"><VIcon name="settings" size={12} /></button>
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
        .vsb-dot { width: 6px; height: 6px; border-radius: 50%; background: #28c840; }
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
        .sbg { padding-bottom: 14px; }
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
          font-size: 13px;
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

function VerveToolbar({ route }) {
  const labels = {
    dashboard: "Werk", editor: "Kapitel 7 — Der Brief am Bahnsteig",
    characters: "Figuren", world: "Fraktionen", inbox: "Inbox",
    consistency: "Konsistenz-Check", chat: "Wissens-Chat", book: "Buch II — Salzwacht",
    library: "Alle Werke",
  };
  const showEditorTools = route === "editor";
  return (
    <div className="vtb">
      <button className="vtb-btn"><VIcon name="sidebar" size={13} /></button>
      <div className="vtb-divider"/>
      <span className="vtb-title">{labels[route] || "Verve"}</span>
      {route !== "library" && <span className="vtb-sub">· Die Eiserne Stunde</span>}
      <div style={{flex: 1}}/>
      {showEditorTools && (
        <>
          <button className="vtb-btn"><VIcon name="focus" size={13}/><span>Focus</span></button>
          <button className="vtb-btn vtb-btn-active"><VIcon name="doc.text" size={13}/><span>Einzelnes Kapitel</span></button>
          <div className="vtb-divider"/>
        </>
      )}
      <button className="vtb-btn"><VIcon name="bubble" size={13} /></button>
      <button className="vtb-btn"><VIcon name="shield.check" size={13} /></button>
      <button className="vtb-btn"><VIcon name="share" size={13} /></button>
      {showEditorTools && <button className="vtb-btn vtb-btn-active"><VIcon name="inspector" size={13} /></button>}
      <button className="vtb-btn"><VIcon name="settings" size={13} /></button>

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

function VerveRoute({ route }) {
  if (route === "editor") return <RouteEditor />;
  if (route === "characters") return <RouteCharacters />;
  if (route === "world") return <RouteWorld />;
  if (route === "dashboard") return <RouteDashboard />;
  if (route === "consistency") return <RouteConsistency />;
  if (route === "chat") return <RouteChat />;
  if (route === "library") return <RouteLibrary />;
  if (route === "inbox") return <RouteInbox />;
  if (route === "book") return <RouteBook />;
  return <RouteEditor />;
}

// ---------- Editor ----------
function RouteEditor() {
  const text = `Sie wartete am Bahnsteig, der Brief ungeöffnet in der Manteltasche. Die Schaffnerin pfiff zweimal, und der Zug aus Aschemund schob sich in die Halle, müde, voller Schnee.

Aelara dachte an das, was Joran gesagt hatte. Drei Tage. Drei Tage, dann sind wir in Lichtenfels. Sie wusste, dass es eine Lüge war — eine notwendige, eine, die ihn am Leben hielt. Aber eine Lüge.

Eine Krähe saß auf dem Geländer. Sie blickte Aelara an, als wüsste sie, was im Brief stand.`;
  return (
    <div className="re">
      <div className="re-paper">
        <div className="re-meta">
          <span>KAPITEL 7</span>
          <span className="re-dot">·</span>
          <span>SZENE 12</span>
          <span className="re-dot">·</span>
          <span>POV: Aelara</span>
          <span className="re-dot">·</span>
          <span className="re-pill">Konflikt</span>
        </div>
        <h1 className="re-title">Der Brief am Bahnsteig</h1>
        <div className="re-body">
          {text.split("\n\n").map((p, i) => (
            <p key={i}>
              {i === 1 ? (
                <>Aelara dachte an das, was <span className="re-link">Joran</span> gesagt hatte. <span className="re-italic">Drei Tage. Drei Tage, dann sind wir in <span className="re-link">Lichtenfels</span>.</span> Sie wusste, dass es eine Lüge war — eine notwendige, eine, die ihn am Leben hielt. Aber eine Lüge.</>
              ) : i === 2 ? (
                <>Eine <span className="re-link">Krähe</span> saß auf dem Geländer. Sie blickte Aelara an, als wüsste sie, was im Brief stand.<span className="re-caret"/></>
              ) : p}
            </p>
          ))}
        </div>
      </div>
      <style>{`
        .re { height: 100%; overflow: hidden; display: flex; justify-content: center; padding: 48px 32px; }
        .re-paper { max-width: 680px; width: 100%; }
        .re-meta {
          display: flex; gap: 8px; align-items: center;
          font-size: 11px; font-weight: 600; letter-spacing: 0.6px;
          color: var(--t-ter);
          margin-bottom: 16px;
        }
        .re-dot { opacity: 0.5; }
        .re-pill {
          padding: 2px 8px;
          background: var(--t-accent-soft);
          color: var(--t-accent);
          border-radius: 999px;
          letter-spacing: 0.3px;
        }
        .re-title {
          font-family: Georgia, serif;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 0 0 28px;
          color: var(--t-pri);
        }
        .re-body {
          font-family: Georgia, serif;
          font-size: 17px;
          line-height: 1.7;
          color: var(--t-pri);
        }
        .re-body p { margin: 0 0 18px; text-wrap: pretty; }
        .re-link {
          color: var(--t-accent);
          border-bottom: 0.5px dashed var(--t-accent);
          cursor: pointer;
        }
        .re-italic { font-style: italic; color: var(--t-sec); }
        .re-caret {
          display: inline-block;
          width: 1.5px; height: 0.95em;
          background: var(--t-accent);
          margin-left: 1px;
          vertical-align: -0.1em;
          animation: re-blink 1s step-end infinite;
        }
        @keyframes re-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
      `}</style>
    </div>
  );
}

function VerveInspector() {
  return (
    <aside className="vins">
      <div className="vins-tabs">
        <span className="vins-tab vins-tab-active">Szene</span>
        <span className="vins-tab">KI</span>
        <span className="vins-tab">Notizen</span>
      </div>
      <div className="vins-section">
        <div className="vins-label">Status</div>
        <div className="vins-pills">
          <span className="vins-pill vins-pill-active">Entwurf</span>
          <span className="vins-pill">Überarbeiten</span>
          <span className="vins-pill">Final</span>
        </div>
      </div>
      <div className="vins-section">
        <div className="vins-label">Figuren in Szene</div>
        <div className="vins-rows">
          <InspectorRow name="Aelara Vahn" role="POV" tone="accent"/>
          <InspectorRow name="Joran v. Lichten" role="erwähnt" />
          <InspectorRow name="Die Krähe" role="präsent" />
        </div>
      </div>
      <div className="vins-section">
        <div className="vins-label">Wörter</div>
        <div className="vins-stat">318 <span>Wörter</span></div>
        <div className="vins-bar"><div className="vins-bar-fill" style={{width: "64%"}}/></div>
        <div className="vins-stat-meta">Ziel: 500 Wörter · 64%</div>
      </div>
      <div className="vins-section">
        <div className="vins-label-row">
          <div className="vins-label">KI-Hinweise</div>
          <span className="vins-spark"><VIcon name="sparkle" size={10}/></span>
        </div>
        <div className="vins-hint">
          <VIcon name="checkmark.circle" size={13}/>
          <span>Konsistent mit Kap. 5</span>
        </div>
        <div className="vins-hint vins-hint-warn">
          <VIcon name="exclamation" size={13}/>
          <span>"Drei Tage" steht im Konflikt zu Kap. 9 — dort: vier Tage</span>
        </div>
      </div>
      <style>{`
        .vins {
          width: 320px; flex-shrink: 0;
          background: var(--t-sidebar);
          border-left: 0.5px solid var(--t-divider);
          padding: 16px 16px 0;
          display: flex; flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }
        .vins-tabs { display: flex; gap: 4px; padding: 2px; background: var(--t-hover); border-radius: 7px; }
        .vins-tab {
          flex: 1; text-align: center;
          padding: 4px 0;
          font-size: 12px;
          color: var(--t-sec);
          border-radius: 5px;
          cursor: pointer;
        }
        .vins-tab-active { background: var(--t-card); color: var(--t-pri); box-shadow: 0 0.5px 0 rgba(0,0,0,0.1); }
        .vins-section { padding-bottom: 14px; border-bottom: 0.5px solid var(--t-divider); }
        .vins-section:last-child { border-bottom: 0; }
        .vins-label { font-size: 11px; font-weight: 600; letter-spacing: 0.4px; color: var(--t-ter); text-transform: uppercase; margin-bottom: 8px; }
        .vins-label-row { display: flex; justify-content: space-between; align-items: center; }
        .vins-spark { color: var(--t-accent); }
        .vins-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .vins-pill { padding: 3px 10px; background: var(--t-hover); border-radius: 999px; font-size: 11px; color: var(--t-sec); }
        .vins-pill-active { background: var(--t-accent-soft); color: var(--t-accent); font-weight: 500; }
        .vins-rows { display: flex; flex-direction: column; gap: 4px; }
        .vins-stat { font-family: Georgia, serif; font-size: 28px; font-weight: 500; color: var(--t-pri); }
        .vins-stat span { font-family: -apple-system, sans-serif; font-size: 12px; color: var(--t-ter); margin-left: 6px; }
        .vins-bar { height: 4px; background: var(--t-hover); border-radius: 2px; margin-top: 6px; overflow: hidden; }
        .vins-bar-fill { height: 100%; background: var(--t-accent); }
        .vins-stat-meta { font-size: 11px; color: var(--t-ter); margin-top: 4px; }
        .vins-hint {
          display: flex; gap: 8px; align-items: flex-start;
          padding: 8px 10px;
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-radius: 6px;
          font-size: 12px;
          color: var(--t-sec);
          margin-bottom: 6px;
        }
        .vins-hint :first-child { color: #28c840; flex-shrink: 0; margin-top: 1px; }
        .vins-hint-warn :first-child { color: #febc2e; }
      `}</style>
    </aside>
  );
}

function InspectorRow({ name, role, tone }) {
  return (
    <div className="iro">
      <span className={`iro-dot ${tone === "accent" ? "iro-dot-accent" : ""}`}/>
      <span className="iro-name">{name}</span>
      <span className="iro-role">{role}</span>
      <style>{`
        .iro { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
        .iro-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--t-ter); }
        .iro-dot-accent { background: var(--t-accent); box-shadow: 0 0 8px var(--t-accent); }
        .iro-name { flex: 1; font-size: 12.5px; }
        .iro-role { font-size: 11px; color: var(--t-ter); }
      `}</style>
    </div>
  );
}

// ---------- Characters ----------
function RouteCharacters() {
  const chars = [
    {n: "Aelara Vahn", r: "Protagonistin", g: ["#7A1F2B", "#3a0f15"], i: "AV", tags: ["POV", "Buch I–III"]},
    {n: "Joran von Lichten", r: "Verbündeter", g: ["#1E3A8A", "#0f1d44"], i: "JL", tags: ["Buch II"]},
    {n: "Die Krähe", r: "Antagonist", g: ["#1F2937", "#0a0d12"], i: "K", tags: ["Mysterium"]},
    {n: "Sister Mira", r: "Mentorin", g: ["#3F6B3A", "#1f3520"], i: "SM", tags: ["Buch I"]},
    {n: "Tobin Halberg", r: "Bote", g: ["#B8602B", "#5c3015"], i: "TH", tags: ["Nebenrolle"]},
    {n: "Frau Vesper", r: "Antagonistin", g: ["#7A1F2B", "#3a0f15"], i: "FV", tags: ["Buch II"]},
  ];
  return (
    <div className="rch">
      <div className="rch-head">
        <div>
          <h2>Figuren</h2>
          <span>17 Einträge · Die Eiserne Stunde</span>
        </div>
        <div className="rch-tools">
          <span className="rch-search"><VIcon name="search" size={12}/>Filtern…</span>
          <span className="rch-btn rch-btn-acc"><VIcon name="sparkle" size={11}/>Smart-Import</span>
          <span className="rch-btn"><VIcon name="plus" size={11}/>Neue Figur</span>
        </div>
      </div>
      <div className="rch-grid">
        {chars.map(c => (
          <div key={c.n} className="rch-card">
            <div className="rch-portrait" style={{background: `linear-gradient(135deg, ${c.g[0]}, ${c.g[1]})`}}>
              <span>{c.i}</span>
            </div>
            <div className="rch-body">
              <div className="rch-name">{c.n}</div>
              <div className="rch-role">{c.r}</div>
              <div className="rch-tags">
                {c.tags.map(t => <span key={t} className="rch-tag">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .rch { padding: 28px 32px; height: 100%; overflow: hidden; }
        .rch-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
        .rch-head h2 { font-family: Georgia, serif; font-size: 26px; font-weight: 600; margin: 0 0 4px; }
        .rch-head span { font-size: 12.5px; color: var(--t-ter); }
        .rch-tools { display: flex; gap: 8px; align-items: center; }
        .rch-search { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; background: var(--t-hover); border-radius: 6px; font-size: 12px; color: var(--t-ter); }
        .rch-btn { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 6px; font-size: 12.5px; color: var(--t-pri); }
        .rch-btn-acc { background: var(--t-accent); color: white; border-color: transparent; }
        .rch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .rch-card {
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .rch-portrait {
          aspect-ratio: 4/3;
          display: grid; place-items: center;
          font-family: Georgia, serif;
          font-size: 36px;
          font-weight: 600;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.02em;
          position: relative;
        }
        .rch-portrait::after {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08), transparent 60%);
        }
        .rch-body { padding: 12px 14px 14px; height: 78px; }
        .rch-name { font-family: Georgia, serif; font-size: 14.5px; font-weight: 600; color: var(--t-pri); }
        .rch-role { font-size: 11.5px; color: var(--t-sec); margin-top: 2px; }
        .rch-tags { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }
        .rch-tag { font-size: 10px; padding: 2px 7px; background: var(--t-hover); border-radius: 999px; color: var(--t-ter); }
      `}</style>
    </div>
  );
}

// ---------- World (Fraktionen-Detail) ----------
function RouteWorld() {
  return (
    <div className="rwo">
      <div className="rwo-side">
        <div className="rwo-cat-title">Fraktionen <span>4</span></div>
        <div className="rwo-list">
          <RWoItem name="Haus Vahn" sub="Verarmter Adel" active />
          <RWoItem name="Bündnis der Salzwacht" sub="Militär" />
          <RWoItem name="Orden vom Atem" sub="Religion" />
          <RWoItem name="Die Schwarze Krone" sub="Geheimbund" />
        </div>
      </div>
      <div className="rwo-detail">
        <div className="rwo-cover" />
        <div className="rwo-cover-meta">
          <span className="rwo-kind">FRAKTION</span>
          <h2>Haus Vahn</h2>
          <span className="rwo-sub">Verarmter Adel · Norden · Buch I–III</span>
        </div>
        <div className="rwo-fields">
          <RWoField label="Sitz" value="Lichtenfels, Hafenstadt im Norden" />
          <RWoField label="Wappen" value="Drei Krähen auf silbernem Grund" />
          <RWoField label="Zustand" value="Verarmt nach dem Aschebrand. Allianz mit Joran von Lichten hält das Haus zusammen." multiline />
          <RWoField label="Verbindungen" value="Aelara Vahn (Erbin) · Joran v. Lichten (Verbündeter) · Frau Vesper (Feind)" />
        </div>
        <div className="rwo-ai">
          <div className="rwo-ai-spark"><VIcon name="sparkle" size={11}/></div>
          <div>
            <div className="rwo-ai-title">KI schlägt vor</div>
            <div className="rwo-ai-body">"Eiserne Stunde" könnte ein Ritual von Haus Vahn sein — passt zum Wappen und der Krone-Symbolik in Kap. 3.</div>
            <div className="rwo-ai-act"><span>✓ Übernehmen</span><span>✗ Verwerfen</span></div>
          </div>
        </div>
      </div>
      <style>{`
        .rwo { display: grid; grid-template-columns: 240px 1fr; height: 100%; overflow: hidden; }
        .rwo-side { background: var(--t-card2); border-right: 0.5px solid var(--t-divider); padding: 16px 0; }
        .rwo-cat-title {
          padding: 4px 16px 12px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase;
          color: var(--t-ter);
        }
        .rwo-cat-title span { float: right; font-variant-numeric: tabular-nums; }
        .rwo-list { display: flex; flex-direction: column; gap: 1px; padding: 0 6px; }
        .rwo-detail { padding: 32px 40px; overflow-y: auto; }
        .rwo-cover {
          aspect-ratio: 16/5;
          border-radius: 10px;
          background:
            radial-gradient(circle at 20% 40%, rgba(122,31,43,0.6), transparent 50%),
            radial-gradient(circle at 80% 60%, rgba(31,41,55,0.7), transparent 50%),
            linear-gradient(135deg, #2a1015, #0a0d12);
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        .rwo-cover::after {
          content: ""; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          opacity: 0.4;
          mix-blend-mode: overlay;
        }
        .rwo-cover-meta { margin-bottom: 24px; }
        .rwo-kind { font-size: 11px; font-weight: 600; letter-spacing: 0.6px; color: var(--t-accent); }
        .rwo-cover-meta h2 { font-family: Georgia, serif; font-size: 30px; font-weight: 600; margin: 6px 0 4px; }
        .rwo-sub { font-size: 13px; color: var(--t-sec); }
        .rwo-fields { display: flex; flex-direction: column; gap: 10px; padding-bottom: 24px; border-bottom: 0.5px solid var(--t-divider); margin-bottom: 18px; }
        .rwo-ai {
          display: flex; gap: 12px;
          padding: 14px 16px;
          background: var(--t-accent-soft);
          border: 0.5px solid var(--t-accent);
          border-radius: 8px;
        }
        .rwo-ai-spark {
          flex-shrink: 0;
          width: 24px; height: 24px;
          background: var(--t-accent);
          color: white;
          border-radius: 6px;
          display: grid; place-items: center;
        }
        .rwo-ai-title { font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; color: var(--t-accent); }
        .rwo-ai-body { font-family: Georgia, serif; font-size: 14px; font-style: italic; color: var(--t-pri); margin-top: 4px; line-height: 1.5; }
        .rwo-ai-act { display: flex; gap: 12px; margin-top: 8px; font-size: 12px; }
        .rwo-ai-act span { color: var(--t-sec); cursor: pointer; }
        .rwo-ai-act span:first-child { color: var(--t-accent); font-weight: 500; }
      `}</style>
    </div>
  );
}

function RWoItem({ name, sub, active }) {
  return (
    <div className={`rwoi ${active ? "rwoi-act" : ""}`}>
      <div className="rwoi-name">{name}</div>
      <div className="rwoi-sub">{sub}</div>
      <style>{`
        .rwoi { padding: 8px 10px; border-radius: 6px; cursor: pointer; }
        .rwoi:hover { background: var(--t-hover); }
        .rwoi-act { background: var(--t-sel); }
        .rwoi-act .rwoi-name { color: var(--t-pri); }
        .rwoi-name { font-size: 13px; color: var(--t-sec); font-weight: 500; }
        .rwoi-sub { font-size: 11px; color: var(--t-ter); margin-top: 1px; }
      `}</style>
    </div>
  );
}

function RWoField({ label, value, multiline }) {
  return (
    <div className="rwf">
      <div className="rwf-label">{label}</div>
      <div className={`rwf-value ${multiline ? "rwf-multi" : ""}`}>{value}</div>
      <style>{`
        .rwf { display: grid; grid-template-columns: 130px 1fr; gap: 16px; align-items: start; }
        .rwf-label { font-size: 12px; color: var(--t-sec); padding-top: 5px; }
        .rwf-value { font-size: 13px; color: var(--t-pri); padding: 5px 10px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 6px; }
        .rwf-multi { line-height: 1.5; }
      `}</style>
    </div>
  );
}

// ---------- Chat ----------
function RouteChat() {
  return (
    <div className="rch2">
      <div className="rch2-head">
        <h2>Wissens-Chat</h2>
        <span className="rch2-prov"><span className="rch2-dot"/>Ollama · llama3.1:8b · lokal</span>
      </div>
      <div className="rch2-msgs">
        <div className="rch2-user">Was hat Aelara in Kap. 3 über die Krähe erfahren?</div>
        <div className="rch2-bot">
          <div className="rch2-bot-avatar"><VIcon name="sparkle" size={11}/></div>
          <div className="rch2-bot-body">
            <p>In Kapitel 3, Szene 8 hört Aelara die Krähe zum ersten Mal sprechen — sie nennt ihren Namen. Das verbindet sie mit einer Erinnerung an ihre Mutter, die in der "Eisernen Stunde" eine Krähe als Fürsprecherin hatte.</p>
            <p>Wichtig: Die Krähe ist kein gewöhnliches Tier. Aelara erkennt das, sagt es aber niemandem.</p>
            <div className="rch2-sources">
              <span><VIcon name="doc" size={10}/>Kap. 3 · Szene 8</span>
              <span><VIcon name="people" size={10}/>Aelara Vahn</span>
              <span><VIcon name="globe" size={10}/>Die Krähe</span>
            </div>
          </div>
        </div>
        <div className="rch2-user">Welche anderen Figuren haben sie gesehen?</div>
        <div className="rch2-bot rch2-streaming">
          <div className="rch2-bot-avatar"><VIcon name="sparkle" size={11}/></div>
          <div className="rch2-bot-body">
            <p>In Buch I sehen die Krähe: Aelara (mehrfach), Joran (einmalig, Kap. 6), Tobin (kurz, Kap. 9). Sister Mira erwähnt sie<span className="rch2-caret"/></p>
          </div>
        </div>
      </div>
      <div className="rch2-input">
        <VIcon name="paperclip" size={13}/>
        <span>Frage zu deinem Werk stellen…</span>
        <kbd>↩</kbd>
      </div>
      <style>{`
        .rch2 { display: flex; flex-direction: column; height: 100%; padding: 24px 32px 0; max-width: 880px; margin: 0 auto; width: 100%; }
        .rch2-head { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 16px; border-bottom: 0.5px solid var(--t-divider); margin-bottom: 16px; }
        .rch2-head h2 { font-family: Georgia, serif; font-size: 22px; font-weight: 600; margin: 0; }
        .rch2-prov { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--t-ter); }
        .rch2-dot { width: 6px; height: 6px; border-radius: 50%; background: #28c840; box-shadow: 0 0 8px #28c840; }
        .rch2-msgs { flex: 1; overflow: hidden; display: flex; flex-direction: column; gap: 16px; }
        .rch2-user { align-self: flex-end; max-width: 70%; padding: 9px 14px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 14px; border-bottom-right-radius: 4px; font-size: 13.5px; color: var(--t-pri); }
        .rch2-bot { display: flex; gap: 12px; max-width: 85%; }
        .rch2-bot-avatar {
          flex-shrink: 0; width: 28px; height: 28px;
          background: var(--t-accent); color: white;
          border-radius: 50%;
          display: grid; place-items: center;
        }
        .rch2-bot-body { background: var(--t-accent-soft); border-radius: 14px; border-bottom-left-radius: 4px; padding: 10px 14px; font-size: 13.5px; color: var(--t-pri); line-height: 1.55; border: 0.5px solid color-mix(in srgb, var(--t-accent) 30%, transparent); }
        .rch2-bot-body p { margin: 0 0 8px; }
        .rch2-bot-body p:last-child { margin: 0; }
        .rch2-sources { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; padding-top: 10px; border-top: 0.5px solid color-mix(in srgb, var(--t-accent) 20%, transparent); }
        .rch2-sources span { display: inline-flex; gap: 4px; align-items: center; font-size: 11px; padding: 3px 8px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 999px; color: var(--t-sec); }
        .rch2-caret { display: inline-block; width: 1.5px; height: 0.9em; background: var(--t-accent); margin-left: 1px; vertical-align: -0.1em; animation: re-blink 1s step-end infinite; }
        .rch2-input { margin: 16px 0 24px; display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--t-card); border: 0.5px solid var(--t-border-strong); border-radius: 10px; color: var(--t-ter); font-size: 13px; }
        .rch2-input kbd { margin-left: auto; font-family: ui-monospace, monospace; font-size: 11px; padding: 2px 6px; background: var(--t-hover); border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ---------- Consistency ----------
function RouteConsistency() {
  return (
    <div className="rco">
      <div className="rco-head">
        <h2>Konsistenz-Check</h2>
        <span className="rco-meta">2 Konflikte · zuletzt geprüft vor 14 Min</span>
        <span className="rco-btn"><VIcon name="sparkle" size={11}/>Neu prüfen</span>
      </div>
      <div className="rco-list">
        <RcoItem
          severity="high"
          title='"Drei Tage" widerspricht "vier Tage"'
          locA={'Kap. 7, Szene 12 — Joran sagt: „Drei Tage, dann sind wir in Lichtenfels."'}
          locB={'Kap. 9, Szene 3 — Aelara denkt: „Vier Tage waren vergangen."'}
          fix="Reise dauert 3 Tage (Kap. 7 ist Setup) — Kap. 9 zu „Drei Tage waren vergangen“ ändern."
        />
        <RcoItem
          severity="med"
          title="Frau Vesper trägt zwei Augenfarben"
          locA="Kap. 2 — eingeführt mit grünen Augen"
          locB="Kap. 8 — beschrieben mit grauen Augen"
          fix="Grüne Augen sind ihr Markenzeichen (Beziehung zu Haus Vahn). Kap. 8 zu „grün“ ändern."
        />
        <div className="rco-resolved">
          <VIcon name="checkmark.circle" size={13}/>
          <span>3 weitere Konflikte erledigt — vor 2 Tagen.</span>
        </div>
      </div>
      <style>{`
        .rco { padding: 28px 32px; max-width: 880px; margin: 0 auto; width: 100%; height: 100%; overflow: hidden; }
        .rco-head { display: flex; align-items: baseline; gap: 16px; padding-bottom: 16px; border-bottom: 0.5px solid var(--t-divider); margin-bottom: 20px; }
        .rco-head h2 { font-family: Georgia, serif; font-size: 22px; font-weight: 600; margin: 0; }
        .rco-meta { flex: 1; font-size: 12.5px; color: var(--t-ter); }
        .rco-btn { display: inline-flex; gap: 6px; align-items: center; padding: 5px 12px; background: var(--t-accent); color: white; border-radius: 6px; font-size: 12.5px; }
        .rco-list { display: flex; flex-direction: column; gap: 12px; }
        .rco-resolved { display: flex; gap: 8px; align-items: center; padding: 12px; color: var(--t-ter); font-size: 12.5px; }
        .rco-resolved :first-child { color: #28c840; }
      `}</style>
    </div>
  );
}

function RcoItem({ severity, title, locA, locB, fix }) {
  const sevColor = severity === "high" ? "#e85a4f" : "#febc2e";
  return (
    <div className="rci">
      <div className="rci-head">
        <span className="rci-sev" style={{background: sevColor}}/>
        <span className="rci-title">{title}</span>
        <span className="rci-tag">{severity === "high" ? "Hoch" : "Mittel"}</span>
      </div>
      <div className="rci-loc">
        <div className="rci-loc-label">A</div>
        <div className="rci-loc-text">{locA}</div>
      </div>
      <div className="rci-loc">
        <div className="rci-loc-label">B</div>
        <div className="rci-loc-text">{locB}</div>
      </div>
      <div className="rci-fix">
        <VIcon name="sparkle" size={11}/>
        <span><strong>Vorschlag:</strong> {fix}</span>
      </div>
      <div className="rci-acts">
        <span className="rci-act rci-act-prim">Vorschlag übernehmen</span>
        <span className="rci-act">Springe zu A</span>
        <span className="rci-act">Springe zu B</span>
        <span className="rci-act">Ignorieren</span>
      </div>
      <style>{`
        .rci { padding: 16px 18px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 10px; }
        .rci-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .rci-sev { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .rci-title { flex: 1; font-family: Georgia, serif; font-size: 15px; font-weight: 600; color: var(--t-pri); }
        .rci-tag { font-size: 11px; padding: 2px 8px; background: var(--t-hover); border-radius: 999px; color: var(--t-sec); }
        .rci-loc { display: flex; gap: 10px; padding: 8px 10px; background: var(--t-card2); border-radius: 6px; margin-bottom: 4px; font-size: 12.5px; line-height: 1.5; }
        .rci-loc-label { width: 18px; height: 18px; background: var(--t-hover); border-radius: 4px; display: grid; place-items: center; font-family: ui-monospace, monospace; font-size: 10px; color: var(--t-ter); flex-shrink: 0; margin-top: 1px; }
        .rci-loc-text { color: var(--t-sec); font-family: Georgia, serif; font-style: italic; }
        .rci-fix { display: flex; gap: 8px; padding: 10px 12px; background: var(--t-accent-soft); border-radius: 6px; margin-top: 10px; font-size: 12.5px; color: var(--t-pri); line-height: 1.5; }
        .rci-fix :first-child { color: var(--t-accent); flex-shrink: 0; margin-top: 2px; }
        .rci-fix strong { color: var(--t-accent); font-weight: 600; }
        .rci-acts { display: flex; gap: 12px; margin-top: 12px; }
        .rci-act { font-size: 12px; color: var(--t-sec); cursor: pointer; }
        .rci-act-prim { color: var(--t-accent); font-weight: 500; }
      `}</style>
    </div>
  );
}

// ---------- Library ----------
function RouteLibrary() {
  const works = [
    {t: "Die Eiserne Stunde", s: "Reihe · 3 Bücher", g: ["#7A1F2B", "#3a0f15"], i: "ES", w: "84.412 Wörter"},
    {t: "Salzlicht", s: "Roman · Buch I", g: ["#1E3A8A", "#0f1d44"], i: "S", w: "62.108 Wörter"},
    {t: "Die Vogelschneise", s: "Erzählung", g: ["#3F6B3A", "#1f3520"], i: "V", w: "12.300 Wörter"},
    {t: "Aschenpark", s: "Reihe · WIP", g: ["#1F2937", "#0a0d12"], i: "A", w: "4.500 Wörter"},
    {t: "Briefe an V.", s: "Sammlung", g: ["#B8602B", "#5c3015"], i: "B", w: "31.700 Wörter"},
  ];
  return (
    <div className="rli">
      <div className="rli-head">
        <h2>Alle Werke</h2>
        <span className="rli-btn"><VIcon name="plus" size={11}/>Neues Werk</span>
      </div>
      <div className="rli-grid">
        {works.map(w => (
          <div key={w.t} className="rli-card">
            <div className="rli-cover" style={{background: `linear-gradient(135deg, ${w.g[0]}, ${w.g[1]})`}}>
              <div className="rli-cover-glyph">{w.i}</div>
              <div className="rli-cover-meta">
                <div>{w.t}</div>
                <div>J. Hartmann</div>
              </div>
            </div>
            <div className="rli-info">
              <div className="rli-title">{w.t}</div>
              <div className="rli-sub">{w.s}</div>
              <div className="rli-words">{w.w}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .rli { padding: 28px 32px; height: 100%; overflow: hidden; }
        .rli-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; }
        .rli-head h2 { font-family: Georgia, serif; font-size: 26px; font-weight: 600; margin: 0; }
        .rli-btn { display: inline-flex; gap: 6px; align-items: center; padding: 6px 12px; background: var(--t-accent); color: white; border-radius: 6px; font-size: 12.5px; }
        .rli-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .rli-card { transition: transform 0.2s; }
        .rli-cover {
          aspect-ratio: 2/3;
          border-radius: 4px;
          padding: 18px 16px;
          color: rgba(255,255,255,0.92);
          display: flex; flex-direction: column;
          position: relative;
          box-shadow: 4px 0 0 rgba(0,0,0,0.25), 0 8px 30px -8px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .rli-cover::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
        }
        .rli-cover-glyph {
          font-family: Georgia, serif;
          font-size: 56px;
          font-weight: 600;
          font-style: italic;
          flex: 1;
          display: grid; place-items: center;
          opacity: 0.9;
        }
        .rli-cover-meta { font-family: Georgia, serif; }
        .rli-cover-meta div:first-child { font-size: 13px; font-weight: 600; line-height: 1.2; }
        .rli-cover-meta div:last-child { font-size: 10.5px; opacity: 0.7; margin-top: 4px; letter-spacing: 0.3px; }
        .rli-info { padding-top: 12px; }
        .rli-title { font-family: Georgia, serif; font-size: 14px; font-weight: 600; }
        .rli-sub { font-size: 11.5px; color: var(--t-sec); margin-top: 2px; }
        .rli-words { font-size: 11px; color: var(--t-ter); margin-top: 4px; font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}

// ---------- Inbox ----------
function RouteInbox() {
  const items = [
    {t: "Krähe spricht in Wiegenlied der Mutter", k: "Idee", w: "8 Min"},
    {t: "Joran fehlt ein Brief an seine Schwester", k: "Lücke", w: "1 Std"},
    {t: "Dialog: Aelara/Vesper, Kap. 11", k: "Notiz", w: "vor 2 Tagen"},
    {t: "Markdown-Import — Notebook.md", k: "Import", w: "vor 3 Tagen"},
    {t: "Eiserne Stunde = Krönungsritual?", k: "Idee", w: "vor 5 Tagen"},
  ];
  return (
    <div className="rin">
      <div className="rin-head">
        <h2>Inbox</h2>
        <div className="rin-tabs">
          <span className="rin-tab rin-tab-active">Offen <span>3</span></span>
          <span className="rin-tab">Triage</span>
          <span className="rin-tab">Erledigt</span>
        </div>
      </div>
      <div className="rin-list">
        {items.map((it, i) => (
          <div key={i} className="rin-item">
            <span className={`rin-kind rin-${it.k.toLowerCase()}`}>{it.k}</span>
            <span className="rin-title">{it.t}</span>
            <span className="rin-when">{it.w}</span>
          </div>
        ))}
      </div>
      <style>{`
        .rin { padding: 28px 32px; max-width: 800px; margin: 0 auto; width: 100%; }
        .rin-head { padding-bottom: 16px; border-bottom: 0.5px solid var(--t-divider); margin-bottom: 16px; }
        .rin-head h2 { font-family: Georgia, serif; font-size: 22px; font-weight: 600; margin: 0 0 12px; }
        .rin-tabs { display: flex; gap: 4px; }
        .rin-tab { font-size: 12.5px; padding: 4px 12px; border-radius: 6px; color: var(--t-sec); cursor: pointer; }
        .rin-tab span { color: var(--t-ter); margin-left: 4px; }
        .rin-tab-active { background: var(--t-hover); color: var(--t-pri); }
        .rin-list { display: flex; flex-direction: column; gap: 4px; }
        .rin-item {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 14px; align-items: center;
          padding: 10px 14px;
          background: var(--t-card);
          border: 0.5px solid var(--t-border);
          border-radius: 8px;
          font-size: 13px;
        }
        .rin-kind { font-size: 10.5px; padding: 2px 8px; background: var(--t-hover); border-radius: 999px; text-align: center; color: var(--t-sec); }
        .rin-idee { background: var(--t-accent-soft); color: var(--t-accent); }
        .rin-lücke { background: rgba(254,188,46,0.15); color: #febc2e; }
        .rin-title { font-family: Georgia, serif; }
        .rin-when { font-size: 11px; color: var(--t-ter); font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}

// ---------- Dashboard ----------
function RouteDashboard() {
  return (
    <div className="rda">
      <div className="rda-cover" style={{background: "linear-gradient(135deg, #5a1f29, #2d1318)"}}>
        <div className="rda-cover-inner">
          <div className="rda-cover-kind">REIHE · 3 BÜCHER</div>
          <h1>Die Eiserne Stunde</h1>
          <div className="rda-cover-meta">J. Hartmann · seit März 2025</div>
        </div>
      </div>
      <div className="rda-stats">
        <RDaStat n="84.412" l="Wörter" sub="+1.240 heute"/>
        <RDaStat n="42" l="Kapitel" sub="3 in Arbeit"/>
        <RDaStat n="17" l="Figuren" sub="3 POVs"/>
        <RDaStat n="29" l="Welt-Einträge" sub="12 Orte"/>
      </div>
      <div className="rda-row">
        <div className="rda-col">
          <h3>Bücher</h3>
          <RDaBook title="Buch I — Aschemund" sub="Final · 28.812 W" pct={1} status="done"/>
          <RDaBook title="Buch II — Salzwacht" sub="Entwurf · 38.400 W" pct={0.78} status="draft"/>
          <RDaBook title="Buch III — Krönungstag" sub="Plan · 17.200 W" pct={0.34} status="plan"/>
        </div>
        <div className="rda-col">
          <h3>Letzte Aktivität</h3>
          <RDaActivity icon="doc.text" text="Kap. 7 · 1.240 Wörter geschrieben" t="vor 12 Min"/>
          <RDaActivity icon="people" text="Frau Vesper aktualisiert" t="vor 1 Std"/>
          <RDaActivity icon="shield.check" text="2 Konflikte erkannt" t="vor 2 Std"/>
          <RDaActivity icon="tray" text="3 neue Inbox-Notizen" t="heute"/>
        </div>
      </div>
      <style>{`
        .rda { padding: 28px 32px; height: 100%; overflow-y: auto; }
        .rda-cover {
          aspect-ratio: 16/5;
          border-radius: 10px;
          padding: 32px;
          color: white;
          display: flex; align-items: flex-end;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .rda-cover::after {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.1), transparent 60%);
        }
        .rda-cover-inner { position: relative; z-index: 2; }
        .rda-cover-kind { font-size: 11px; font-weight: 600; letter-spacing: 0.6px; opacity: 0.7; }
        .rda-cover h1 { font-family: Georgia, serif; font-size: 36px; font-weight: 600; margin: 8px 0 6px; letter-spacing: -0.01em; }
        .rda-cover-meta { font-size: 13px; opacity: 0.7; }
        .rda-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .rda-row { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; }
        .rda-col h3 { font-family: Georgia, serif; font-size: 16px; font-weight: 600; margin: 0 0 12px; }
      `}</style>
    </div>
  );
}

function RDaStat({n, l, sub}) {
  return (
    <div className="rdast">
      <div className="rdast-n">{n}</div>
      <div className="rdast-l">{l}</div>
      <div className="rdast-s">{sub}</div>
      <style>{`
        .rdast { padding: 16px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 8px; }
        .rdast-n { font-family: Georgia, serif; font-size: 26px; font-weight: 600; color: var(--t-pri); font-variant-numeric: tabular-nums; }
        .rdast-l { font-size: 12px; color: var(--t-sec); margin-top: 2px; }
        .rdast-s { font-size: 11px; color: var(--t-accent); margin-top: 6px; }
      `}</style>
    </div>
  );
}

function RDaBook({title, sub, pct, status}) {
  return (
    <div className="rdab">
      <div className="rdab-info">
        <div className="rdab-title">{title}</div>
        <div className="rdab-sub">{sub}</div>
      </div>
      <div className="rdab-bar"><div style={{width: `${pct*100}%`, background: status==="done" ? "#28c840" : "var(--t-accent)"}}/></div>
      <style>{`
        .rdab { padding: 12px; background: var(--t-card); border: 0.5px solid var(--t-border); border-radius: 8px; margin-bottom: 8px; }
        .rdab-info { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
        .rdab-title { font-family: Georgia, serif; font-size: 13.5px; font-weight: 600; }
        .rdab-sub { font-size: 11px; color: var(--t-ter); }
        .rdab-bar { height: 4px; background: var(--t-hover); border-radius: 2px; overflow: hidden; }
        .rdab-bar > div { height: 100%; }
      `}</style>
    </div>
  );
}

function RDaActivity({icon, text, t}) {
  return (
    <div className="rdac">
      <span className="rdac-icon"><VIcon name={icon} size={12}/></span>
      <span className="rdac-text">{text}</span>
      <span className="rdac-t">{t}</span>
      <style>{`
        .rdac { display: flex; gap: 10px; align-items: center; padding: 8px 0; font-size: 12.5px; }
        .rdac-icon { color: var(--t-accent); }
        .rdac-text { flex: 1; color: var(--t-sec); }
        .rdac-t { font-size: 11px; color: var(--t-ter); }
      `}</style>
    </div>
  );
}

function RouteBook() {
  return <RouteDashboard/>;
}

window.VerveApp = VerveApp;
